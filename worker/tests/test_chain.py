from context import chain as chain  # env of our project src

import pytest


def test_get_single_chain():
    assert chain.get_single_chain(['0', '1'], ['out'], ['vflip', 'hue=s=0', 'fifo']) == '[0][1]vflip,hue=s=0,fifo[out]'
    assert chain.get_single_chain(['0'], ['out1', 'out2'], ['split']) == '[0]split[out1][out2]'
    assert chain.get_single_chain([], ['out1', 'out2'], ['split']) == 'split[out1][out2]'
    with pytest.raises(chain.FilterIsEmptyInChain):
        chain.get_single_chain(['0'], ['out1', 'out2'], [])


def test_generate_overlay_chains():
    overlay_chains = chain.generate_overlay_chains(['man', 'woman', 'kids'], 'family')
    assert '[man]' in overlay_chains[0]
    assert '[woman]' in overlay_chains[0]
    assert '[man]' not in overlay_chains[1]
    assert '[woman]' not in overlay_chains[1]
    assert '[kids]' in overlay_chains[1]
    assert '[family]' in overlay_chains[-1]


def test_generate_fifo_chain():
    assert chain.generate_fifo_chain('abc', 'bcd') == '[abc]fifo[bcd]'
