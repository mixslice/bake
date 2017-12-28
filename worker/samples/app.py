# read fcp-cakes from a json file,
# convert fcp-cake into a ffmpeg-cake
from context import translate as translate
from context import jsonhelper as jsonhelper
from context import worker as worker


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
        layer['resource'] = each['video']['ref']  # G
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

    for each_cake_hash in grouped_fcp_cakes.keys():
        splitted_fcp_cakes = jsonhelper.split_ranges(
            each_cake_hash, grouped_fcp_cakes[each_cake_hash])
        for each_single_cake in splitted_fcp_cakes:
            ffmpeg_cakes.append(get_single_ffmpeg_cake(each_single_cake))

    return ffmpeg_cakes


import threading
import time


def checker(workerobj):
    count = 0
    while True:
        current_status = workerobj.render_progress()
        if 'error' in current_status:
            print '###error', current_status['error']
            count += 1
        elif 'progress' in current_status and current_status['progress'] == 'end':
            print '###finished', current_status
            break
        else:
            print '###in progress', current_status

        if count > 10:
            break
        time.sleep(1)


if __name__ == "__main__":
    grouped_fcp_cakes = jsonhelper.json_file_to_jsonobj('sample.json')

    ffmpeg_cakes = convert_fcp_to_ffmpeg(grouped_fcp_cakes)

    # Fix: r2 or r3 not related to the actual file name
    for each_ffmpeg_cake in ffmpeg_cakes:
        layers = each_ffmpeg_cake['layers']
        for each_layer in layers:
            each_layer['resource'] = each_layer['resource'].replace(
                'r2', 'WP_20140830_14_39_10_Pro.mp4')
            each_layer['resource'] = each_layer['resource'].replace(
                'r3', 'WP_20140830_15_13_44_Pro.mp4')
    # Fix end.

    my_h264_worker = worker.RenderWorker(
        codecflag='-crf 18 -b:v 0 -preset ultrafast')

    check_thread = threading.Thread(target=checker, args=(my_h264_worker,))
    check_thread.setDaemon(True)
    check_thread.start()

    for idx, each_ffmpeg_cake in enumerate(ffmpeg_cakes):
        my_h264_worker.render(each_ffmpeg_cake,
                              each_ffmpeg_cake['uid'] + '.mp4')
        # my_h264_worker.clean_log()

    time.sleep(5)

    # my_vp9_worker = worker.RenderWorker(codecname='libvpx-vp9', codecflag='-crf 18 -b:v 0')
    # check_thread = threading.Thread(target=checker, args=(my_vp9_worker,))
    # check_thread.setDaemon(True)
    # check_thread.start()
    # for idx, each_ffmpeg_cake in enumerate(ffmpeg_cakes):
    #     my_vp9_worker.render(each_ffmpeg_cake, each_ffmpeg_cake['uid'] + '.webm')
    #     # my_vp9_worker.clean_log()

    # time.sleep(5)
