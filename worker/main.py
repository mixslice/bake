#!/usr/bin/env python
#_*_ encoding: utf-8 _*_

import webapp2
import time
import json
import os
import threading
import datetime
from cook import worker as worker  # Video render and concat unit
from cook import translate as translate
from convert import jsonhelper as jsonhelper  # convert functions about json
from paste import httpserver
import redis

# Global configuration of server environment.
config = {}
config['worker'] = None
config['redis-server'] = os.environ['REDIS_SERVER']
config['redis-server-port'] = '6379'
config['videos-folder'] = '/videos/'  # Must have a trailing /
videos_folder = '/videos/'  # Must have a trailing /
r = redis.StrictRedis(
    host=config['redis-server'], port=config['redis-server-port'], db=0)


def get_single_ffmpeg_cake(fcpcake):
    ''' input a dict obj, represents a fcp cake
        return a dict obj, represents a ffmpeg cake
    '''
    cake_uid = fcpcake['cake_uid']
    cake_range_start = fcpcake['range_start']
    cake_range_end = fcpcake['range_end']

    layers = []
    for each in fcpcake['clips']:
        clip_delay_offset = each[
            'offset']  # Clip Delay according to the base clip.
        layer = {}
        layer['resource'] = each['video']['ref'] if '.mp4' in each['video'][
            'ref'] else each['video']['ref'] + '.mp4'  # G
        layer['resource'] = videos_folder + layer['resource']
        layer['start'] = cake_range_start - clip_delay_offset  # G
        layer['end'] = cake_range_end - clip_delay_offset  # G
        layer['filters'] = [
            translate.fcp_effect_to_ffmpeg_filter(every)
            for every in each.keys() if 'adjust' in every
        ]
        layer['filters'].extend([
            translate.fcp_effect_to_ffmpeg_filter(every)
            for every in each.keys() if 'filter' in every
        ])
        layers.append(layer)

    return {
        'uid': cake_uid,
        'layers': layers,
        'range_start': cake_range_start,
        'range_end': cake_range_end
    }


def convert_fcp_to_ffmpeg(grouped_fcp_cakes):
    ''' convert fcp cakes into ffmpeg cakes '''
    ffmpeg_cakes = [
    ]  # The ffmpeg cakes ready to be put on the oven of ffmpeg to cook

    for each_fcp_cake_obj in grouped_fcp_cakes:
        splitted_fcp_cakes = jsonhelper.split_ranges(each_fcp_cake_obj['hash'],
                                                     each_fcp_cake_obj)
        for each_single_cake in splitted_fcp_cakes:
            ffmpeg_cakes.append(get_single_ffmpeg_cake(each_single_cake))

    return ffmpeg_cakes


def process_cakes(jsonobj):
    fcp_cakes = jsonobj['cakes']
    ffmpeg_cakes = convert_fcp_to_ffmpeg(fcp_cakes)
    return ffmpeg_cakes


class ScreenReporter(worker.ReportHandler):

    def report(self, messageobj):
        print '### Report to screen', str(messageobj)


class RedisReporter(worker.ReportHandler):

    def report(self, messageobj):
        print '### Report to Redis'
        r.set(messageobj['cake_uid'], messageobj['ffmpeg_status'])


def render_ffmpeg_cakes(ffmpeg_cakes):
    for idx, each_ffmpeg_cake in enumerate(ffmpeg_cakes):
        my_h264_worker = worker.RenderWorker(
            codecflag='-crf 18 -preset veryfast')
        my_h264_worker.add_handler(handler=ScreenReporter('screen_reporter'))
        my_h264_worker.add_handler(handler=RedisReporter('redis_reporter'))

        check_thread = threading.Thread(target=my_h264_worker.report_progress)
        check_thread.setDaemon(True)
        check_thread.start()

        my_h264_worker.render(each_ffmpeg_cake,
                              videos_folder + each_ffmpeg_cake['uid'] + '.mp4')
        time.sleep(2)  # let the report till the end.
        # check_thread.join(60)  # Let the thread die in 60 seconds anyway


class RenderSingleCake(webapp2.RequestHandler):

    def get(self):
        try:
            jsonstring = self.request.body
            payload = json.loads(jsonstring)  # json payload
            if payload:
                ffmpeg_cakes = process_cakes(payload)
                ffmpeg_cakes_uid_list = [each['uid'] for each in ffmpeg_cakes]
                return_dict = {'ffmpeg_cakes': ffmpeg_cakes_uid_list}
                self.response.out.write(json.dumps(return_dict))

                background = threading.Thread(
                    target=render_ffmpeg_cakes,
                    args=(ffmpeg_cakes,),
                    name="rendering-background-serivce")
                background.start()
            else:
                self.error(400)
                self.response.out.write('Payload Empty, Check Your Json.')
        except Exception as ex:
            self.error(400)
            self.response.out.write(type(ex).__name__ + str(ex))

    def post(self):
        self.get()  # redirect to get()


def concat_files(sequence, result_file_name):
    my_h264_worker = worker.RenderWorker(codecflag='-crf 18 -preset veryfast')
    my_h264_worker.add_handler(handler=ScreenReporter('screen_reporter'))
    file_name_list = []
    for each in sequence:
        real_file_name = each['src'] if '.mp4' in each[
            'src'] else each['src'] + '.mp4'
        real_file_name = videos_folder + real_file_name
        if 'start' not in each:
            file_name_list.append(real_file_name)
        else:  # need to trim
            trimed_file_name = '%s-%s-%s.mp4' % (each['src'].split('-')[0],
                                                 each['start'], each['end'])
            trimed_file_name = videos_folder + trimed_file_name
            my_h264_worker.trim(real_file_name, each['start'], each['end'],
                                trimed_file_name, 30)
            file_name_list.append(trimed_file_name)

    return my_h264_worker.concat(file_name_list, result_file_name)


class ConcatFiles(webapp2.RequestHandler):

    def get(self):
        try:
            jsonstring = self.request.body
            payload = json.loads(jsonstring)
            if payload:
                sequence = payload['sequence']
                now = datetime.datetime.now()
                str_now = datetime.datetime.strftime(now, '%Y%m%d-%H%M%S')
                result_file_name = 'demo-' + str_now + '.mp4'
                success = concat_files(sequence,
                                       videos_folder + result_file_name)
                return_dict = {}
                return_dict['result_file_name'] = result_file_name
                return_dict['success'] = success
                self.response.out.write(json.dumps(return_dict))
            else:
                self.error(400)
                self.response.out.write('Payload Empty, Check Your Json.')
        except Exception as ex:
            self.error(400)
            self.response.out.write(type(ex).__name__ + str(ex))

    def post(self):
        self.get()  # redirect to get()


app = webapp2.WSGIApplication(
    [
        ('/app/render', RenderSingleCake),
        ('/app/concat', ConcatFiles),
    ],
    debug=True,
    config=config)


def main():
    httpserver.serve(app, host='0.0.0.0', port='8080')


if __name__ == '__main__':
    main()
