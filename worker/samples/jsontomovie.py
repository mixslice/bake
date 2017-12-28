# read fcp-cakes from a json file,
# convert fcp-cake into a ffmpeg-cake
from context import translate as translate
from context import bake as bake
from context import jsonhelper as jsonhelper


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

    return {'uid': cake_uid, 'layers': layers}


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


def get_render_commands(ffmpeg_cakes):
    ''' Input: ffmpeg_cakes description, in a list. final_concat_name shall contain .mp4
    Output: Command lines that can be executed by bash/sh
    '''
    render_commands = []  # Command line to execute one by one finally.
    movie_chunk_names = []  # Generated movie file names on the hard disk.
    for each_ffmpeg_cake in ffmpeg_cakes:
        output_file_name = '%s.mp4' % each_ffmpeg_cake['uid']
        render_commands.append(
            bake.generate_cake_render_command(each_ffmpeg_cake,
                                              output_file_name))
        movie_chunk_names.append(output_file_name)

    return render_commands


def render_ffmpeg_cakes(render_commands, debug=False):
    ''' Real operating system execution to render ffmpeg cake '''
    if debug:
        for each in render_commands:
            print each
        return

    import subprocess
    for each in render_commands:  # bake each ffmpeg cake into movie chunk
        print each
        print '-----------------'
        returncode = subprocess.call(each, shell=True)
        if returncode > 0:
            raise Exception('Command %s failed. Exit code %d' % (each,
                                                                 returncode))


if __name__ == "__main__":
    grouped_fcp_cakes = jsonhelper.json_file_to_jsonobj('sample.json')

    ffmpeg_cakes = convert_fcp_to_ffmpeg(grouped_fcp_cakes)

    render_commands = get_render_commands(ffmpeg_cakes)

    # Fix: r2 or r3 not related to the actual file name
    linked_render_commands = []
    for each in render_commands:
        temp = each.replace(' r2 ', ' WP_20140830_14_39_10_Pro.mp4 ').replace(
            ' r3 ', ' WP_20140830_15_13_44_Pro.mp4 ')
        linked_render_commands.append(temp)

    render_commands = linked_render_commands
    # Fix end.

    render_ffmpeg_cakes(
        render_commands, debug=True)  # debug = False will try to render
    # join the movie parts together into a final movie.
    # commandline = []
    # commandline.append('/bin/bash')
    # commandline.append('-c')
    # commandline.append(render_commands[-1])
    # child = subprocess.Popen(commandline)
