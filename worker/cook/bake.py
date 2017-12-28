import chain
import effect


def filter_adapter(filterobj):
    ''' ffmpeg filter dict object --> ffmpeg filter str '''
    return effect.make_filter(filterobj['name'], *filterobj['values'],
                              **filterobj['kwvalues'])


def trim_filter_adapter(layerobj):
    ''' make a trim ffmpeg filter str '''
    return effect.make_filter(effect.preset_filters['trim'], **{
        'start_frame': layerobj['start'],
        'end_frame': layerobj['end']
    })


def setpts_filter_adapter(layerobj):
    ''' make a -reset starting frame- ffmpeg filter str '''
    return effect.make_filter(effect.preset_filters['setpts'],
                              *['PTS-STARTPTS'])


def _generate_program_location(ffmpeg_location=None):
    ''' Where we can find ffmpeg program on the linux machine'''
    if ffmpeg_location:
        return ffmpeg_location
    else:
        return 'ffmpeg'


def _generate_progress_section(logfilename=None):
    ''' ffmpeg -progress switch, logfilename is linux stile location '''
    if logfilename:
        return '-progress %s' % logfilename
    else:
        return '-progress %s' % 'process_log.txt'


def _get_input_files(cake):
    ''' Helper function: get input files from cake,
        return real file names on the hard disk (linux style)
        Or if you input according to ffmpeg protocol,
        don't forget the protocol prefix, see "ffmpeg protocol"
    '''
    return [each['resource'] for each in cake['layers']]


def _generate_input_section(inputfiles):
    ''' Helper function: generate input switch of ffmpeg command,
        like: -i a.mp4 -i b.mp4 ...
        Return: a string
    '''
    return ' '.join(['-i %s' % (each) for each in inputfiles])


def _generate_video_codec_section(codecname, codecflag):
    ''' Helper function: generate codec switch of ffmpeg command,
        like: -codec:v libx264 -crf 18 -preset slow
        You have to fill in "libx264" and "-crf 18 -preset slow"
        Return: a string
    '''
    return '-codec:v %s %s' % (codecname, codecflag)


def get_filtergraph_chains(cake, outputpad):
    ''' From a cake obj, generate a list of chains. Then return.
        You can further join the list to form a filter graph string.
    '''
    temp_prefix = 'processedpad'
    middle_chains = []
    # render each clip with its own effects
    for idx, each in enumerate(cake['layers']):
        temp_chain = ''
        temp_str_filters = []
        temp_str_filters.append(trim_filter_adapter(each))
        temp_str_filters.append(setpts_filter_adapter(each))
        temp_str_filters.extend(
            [filter_adapter(every) for every in each['filters']])
        temp_chain = chain.get_single_chain(
            [str(idx)], [temp_prefix + str(idx)], temp_str_filters)
        middle_chains.append(temp_chain)

    if len(cake['layers']) == 1:
        # print chain.generate_fifo_chain(temp_prefix + str(0), outputpad)
        middle_chains.append(
            chain.generate_fifo_chain(temp_prefix + str(0), outputpad))
        return middle_chains
    else:
        temp_pads = [
            temp_prefix + str(idx) for idx, each in enumerate(cake['layers'])
        ]
        # append a overlay list to it
        middle_chains.extend(
            chain.generate_overlay_chains(temp_pads, outputpad))

    return middle_chains


def generate_cake_render_command(cake,
                                 result_file_name,
                                 codecname='libx264',
                                 codecflag='-crf 18 -preset slow',
                                 ffmpeg_location=None,
                                 progressfilename=None,
                                 overwriteflag='-y'):
    ''' Generate a full ffmpeg command line to render a cake into a result file.
        @cake: The cake obj defined in this file.
        @result_file_name: File name including suffix(.mp4). FFMEG protocol is also supported.
        @codecname: The codec you want to encode the result with.
        @codecflag: Fine tuning codec parameters.
        @ffmpeg_location: the ffmpeg program location.
        @progressfilename: The temp log file of monitring progress. linux style path.
        Return: a command line string.
    '''
    program = _generate_program_location(ffmpeg_location)
    debug_switch = '-v error'
    progress_switch = _generate_progress_section(progressfilename)
    input_switch = _generate_input_section(_get_input_files(cake))
    filter_graph_switch = '-filter_complex "%s"' % ';'.join(
        get_filtergraph_chains(cake, 'out'))
    codec_switch = _generate_video_codec_section(codecname, codecflag)
    output_switch = '-map "[out]" %s' % result_file_name

    temp_bucket = [
        program, debug_switch, overwriteflag, progress_switch, input_switch,
        filter_graph_switch, codec_switch, output_switch
    ]

    return ' '.join(temp_bucket)


def _generate_concat_files_list_option(parts, list_file_name):
    ''' Helper function: no longer need to write a concat.txt file.
        @parts: file names "x.mp4" you want to concat together. Linux style.
        Support ffmpeg protocol.
    '''
    try:
        with open(list_file_name, 'w') as f:
            for each in parts:
                f.write("file '%s'" % each)
                f.write('\n')

        return True
    except:
        return False


def generate_concat_command(parts, result_file_name):
    ''' @parts: files you want to concat, linux style. Support ffmpeg protocol.
        @result_file_name: the result output file name, support ffmpeg protocol.
    '''
    program = 'ffmpeg -y -v error -f concat -safe 0'
    try_list_file = _generate_concat_files_list_option(parts,
                                                       'temp_join_list.txt')
    if try_list_file:
        input_area = '-i %s' % 'temp_join_list.txt'
        method = '-c:v copy %s' % result_file_name
        temp_bucket = [program, input_area, method]
        return ' '.join(temp_bucket)
    else:
        return None


def generate_trim_command(input_file_name,
                          start_time,
                          end_time,
                          result_file_name,
                          codecname='libx264',
                          codecflag='-crf 18 -preset slow'):
    ''' @input_file: input file name, support ffmpeg protocol.
        @start_time: a time based value, HH:MM:SS.ss, not frame value.
        @end_time: same type as start_time.
        @result_file_name: output file name, support ffmpeg protocol.
    '''

    return 'ffmpeg -y -v error -i %s -ss %s -vcodec %s %s -to %s %s' % (
        input_file_name, start_time, codecname, codecflag, end_time,
        result_file_name)
