"""Make an HTML page of sample Unicode pictograms.
"""

import argparse
import os
import unicodedata

import mako.template   # PyPI: Mako.


TEMPLATE_FILE = "template.html"
TITLE = "Unicode Pictograms Demo"

class Block:
    def __init__(self, name, *ranges):
        self.name = name
        self.ranges = ranges
        self.characters = []
        for rng in ranges:
            for start, end in rng:
                for i in range(start, end+1):
                    c = Char(i)
                    if c.name and "CAPITAL" not in c.name:
                        self.characters.append(c)
        self.count = len(self.characters)

    def __repr__(self):
        classname = self.__class__.__name__
        ranges = [(format(x[0], "X"), format(x[1], "X")) for x in self.ranges]
        fmt = "{}({} characters, {})"
        return fmt.format(classname, self.count, self.ranges)

class Char:
    def __init__(self, code):
        self.code = code
        self.hex = format(code, "X")
        self.char = chr(code)
        self.name = unicodedata.name(self.char, None)

    def __repr__(self):
        classname = self.__class__.__name__
        fmt = "{}({:X})"
        return fmt.format(classname, self.code)


def get_parser():
    desc = __doc__.splitlines()[0]
    parser = argparse.ArgumentParser()
    parser.description = desc
    paa = parser.add_argument
    paa("output_file", metavar="OUTPUT.html", help="Output file. (HTNL)")
    return parser

def get_blocks():
    """Get all characters in all Unicode blocks.
    """

    sx = Block("Favorite", [
        (0x0021, 0x0021),
        (0x0023, 0x0024),
        (0x0026, 0x0026),
        (0x0030, 0x0039),
        (0x0061, 0x007a),
        (0x00E0, 0x00E5),
        (0x00F1, 0x00F1),
        (0x00F6, 0x00F6),
        (0x0107, 0x0107),
        (0x0109, 0x0109),
        (0x017A, 0x017A),
        (0x25A0, 0x25A1),
        (0x25A3, 0x25A3),
        (0x2600, 0x2603),
        (0x260E, 0x2615),
        (0x2618, 0x2620),
        (0x2622, 0x2622),
        (0x2624, 0x2624),
        (0x262F, 0x262F),
        (0x263C, 0x266F),
        (0x2672, 0x2672),
        (0x2680, 0x2685),
        (0x2690, 0x269C),
        (0x26A0, 0x26A1),
        (0x26AA, 0x26AB),
        (0x26BD, 0x26BE),
        (0x26C4, 0x26C6),
        (0x26CF, 0x26CF),
        (0x26D4, 0x26D4),
        (0x26DF, 0x26DF),
        (0x26F2, 0x26FA),
        (0x26FD, 0x26FD),
        (0x2700, 0x2700),
        (0x2704, 0x2704),
        (0x2708, 0x2709),
        (0x270B, 0x270D),
        (0x2730, 0x2730),
        (0x2744, 0x2744),
        (0x27A1, 0x27A1),
        (0x2B12, 0x2B19),
        (0x2B60, 0x2B69),
        (0x2B95, 0x2B95),
        (0x1F000, 0x1F02B),
        (0x1F0A0, 0x1F0F5),
        ])
    ai = Block("ASCII", [(0x0020, 0x003F), (0x005B, 0x007E)])
    l1 = Block("Latin-1", [(0x00E0, 0x00FF)])
    la = Block("Latin Extended A", [(0x0100, 0x017E)])
    gm = Block("Geometric Shapes", [(0x25A0, 0x25FF)])
    mi = Block("Miscellaneous", [(0x2600, 0x26FF)])
    dn = Block("Dingbats", [
        (0x2700, 0x2718),
        (0x2729, 0x2768),
        (0x2794, 0x27BF),
        ])
    sy = Block("Miscellaneous Symbols and Arrows", [
        (0x2B12, 0x2BB9),
        (0x2BC0, 0x2BC4),
        (0x2BD1, 0x2BD1),
        ])
    eg = Block("Egyptian Heiroglyphics", [(0x13000, 0x1342E)])
    an = Block("Anatolian Hieroglyphics", [(0x14400, 0x1464F)])
    mj = Block("Mahjong Tiles", [(0x1F000, 0x1F02B)])
    cd = Block("Playing Cards", [(0x1F0A0, 0x1F0F5)])
    sa = Block("Symbols and Pictographs Extended A", [(0x1Fa70, 0x1FA95)])
    return [sx, ai, l1, la, gm, mi, dn, sy, eg, an, mj, cd, sa]

def get_total_count(blocks):
    """Count the total characters in all blocks."""
    ret = 0
    for b in blocks:
        ret += len(b.characters)
    return ret

def get_template_path():
    directory = os.path.dirname(__file__)
    return os.path.join(directory, TEMPLATE_FILE)

def make_html_page(blocks):
    template_path = get_template_path()
    blocks = get_blocks()
    total = get_total_count(blocks)
    t = mako.template.Template(
        filename=template_path,
        strict_undefined=True,
        )
    html = t.render(
        blocks=blocks,
        count=total,
        title=TITLE,
        )
    return html

def main():
    parser = get_parser()
    opts = parser.parse_args()
    blocks = get_blocks()
    count = get_total_count(blocks)
    html = make_html_page(blocks)
    with open(opts.output_file, "w", encoding="utf-8") as f:
        f.write(html)

if __name__ == "__main__":  main()
