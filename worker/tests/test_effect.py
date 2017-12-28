from context import effect as effect  # env of our project src
import pytest


def test_make_filter():
    assert effect.make_filter('vflip') == 'vflip'
    assert effect.make_filter('setpts', *['STARTPTS-PTS', 'GOOD', 'FAMOUS']) == 'setpts=STARTPTS-PTS:GOOD:FAMOUS'
    assert effect.make_filter('vflip', **{'s': 0, 'w': 12}) == 'vflip=s=0:w=12'
    assert effect.make_filter('hue', s=0) == 'hue=s=0'


def test_get_preset_filter():
    assert effect.get_preset_filter('vflip') == 'vflip'
    with pytest.raises(effect.NoSuchPresetFilter):
        effect.get_preset_filter('idontexist')
