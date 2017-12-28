from context import worker as worker
from context import jsonhelper

video_folder = './'


class ScreenReporter(worker.ReportHandler):

    def report(self, messageobj):
        print '### Report to screen', str(messageobj)


my_h264_worker = worker.RenderWorker(codecflag='-crf 18 -preset veryfast')
my_h264_worker.add_handler(handler=ScreenReporter('screen_reporter'))

sequence = jsonhelper.json_file_to_jsonobj('sequence.json')
file_name_list = []
for each in sequence:
    real_file_name = each['src'] if '.mp4' in each[
        'src'] else each['src'] + '.mp4'
    real_file_name = './%s' % real_file_name
    if 'start' not in each:
        file_name_list.append(real_file_name)
    else:  # need to trim
        result_file_name = '%s-%s-%s.mp4' % (each['src'].split('-')[0],
                                             each['start'], each['end'])
        my_h264_worker.trim(real_file_name, each['start'], each['end'],
                            result_file_name, 30)
        file_name_list.append(result_file_name)

my_h264_worker.concat(file_name_list, 'demo.mp4')
