package templates

import (
	"testing"

	"github.com/bakape/meguca/common"
	"github.com/bakape/meguca/config"
	. "github.com/bakape/meguca/test"
	"github.com/valyala/quicktemplate"
)

func TestRenderBody(t *testing.T) {
	config.Set(config.Configs{
		Public: config.Public{
			Links: map[string]string{
				"4chan": "http://4chan.org",
			},
		},
	})
	config.SetBoardConfigs(config.BoardConfigs{
		ID: "a",
	})

	cases := [...]struct {
		name, in, out, string string
		editing               bool
		op                    uint64
		links                 common.LinkMap
		commands              []common.Command
	}{
		{
			name: "closed post",
			in:   "foo\nbar",
			out:  "<span>foo<br></span><span>bar<br></span>",
		},
		{
			name:    "open post",
			in:      "foo\nbar",
			out:     "<span>foo<br></span><span>bar</span>",
			editing: true,
		},
		{
			name: "closed post quote",
			in:   ">foo\nbar",
			out:  "<span><em>&gt;foo</em><br></span><span>bar<br></span>",
		},
		{
			name:    "open post quote",
			in:      ">foo\nbar",
			out:     "<span><em>&gt;foo</em><br></span><span>bar</span>",
			editing: true,
		},
		{
			name: "closed post spoiler",
			in:   "foo**bar** baz",
			out:  "<span>foo<del>bar</del> baz<br></span>",
		},
		{
			name:    "open post spoiler",
			in:      "foo**bar** baz",
			out:     "<span>foo<del>bar</del> baz</span>",
			editing: true,
		},
		{
			name: "hide empty lines",
			in:   "bar\n\n",
			out:  "<span>bar<br></span><br><br>",
		},
		{
			name: "unclosed spoiler tags",
			in:   "**foo",
			out:  "<span><del>foo</del><br></span>",
		},
		{
			name:    "trailing empty open line",
			in:      "foo\n",
			out:     "<span>foo<br></span><span></span>",
			editing: true,
		},
		{
			name: "#flip",
			in:   "#flip\n#flip",
			out: "<span><strong>#flip (true)</strong><br></span>" +
				"<span><strong>#flip (false)</strong><br></span>",
			commands: []common.Command{
				{
					Type: common.Flip,
					Val:  true,
				},
				{
					Type: common.Flip,
					Val:  false,
				},
			},
		},
		{
			name: "#8ball",
			in:   "#8ball",
			out:  "<span><strong>#8ball (bar)</strong><br></span>",
			commands: []common.Command{
				{
					Type: common.EightBall,
					Val:  "bar",
				},
			},
		},
		{
			name: "#pyu",
			in:   "#pyu",
			out:  "<span><strong>#pyu (1)</strong><br></span>",
			commands: []common.Command{
				{
					Type: common.Pyu,
					Val:  int64(1),
				},
			},
		},
		{
			name: "#pcount",
			in:   "#pcount",
			out:  "<span><strong>#pcount (2)</strong><br></span>",
			commands: []common.Command{
				{
					Type: common.Pcount,
					Val:  int64(2),
				},
			},
		},
		{
			name: "single roll dice",
			in:   "#d20",
			out:  "<span><strong>#d20 (22)</strong><br></span>",
			commands: []common.Command{
				{
					Type: common.Dice,
					// This is how values are decoded from the database
					Val: []interface{}{float64(22)},
				},
			},
		},
		{
			name: "multiple roll dice",
			in:   "#2d20",
			out:  "<span><strong>#2d20 (22 + 33 = 55)</strong><br></span>",
			commands: []common.Command{
				{
					Type: common.Dice,
					Val:  []interface{}{float64(22), float64(33)},
				},
			},
		},
		{
			name: "too many dice rolls",
			in:   "#11d20",
			out:  "<span>#11d20<br></span>",
			commands: []common.Command{
				{
					Type: common.Dice,
					Val:  []interface{}{float64(22), float64(33)},
				},
			},
		},
		{
			name: "too many dice faces",
			in:   "#2d101",
			out:  "<span>#2d101<br></span>",
			commands: []common.Command{
				{
					Type: common.Dice,
					Val:  []interface{}{float64(22), float64(33)},
				},
			},
		},
		{
			name: "no valid commands",
			in:   "#flip",
			out:  "<span>#flip<br></span>",
		},
		{
			name: "too few commands",
			in:   "#flip\n#flip",
			out: "<span><strong>#flip (true)</strong><br></span>" +
				"<span>#flip<br></span>",
			commands: []common.Command{
				{
					Type: common.Flip,
					Val:  true,
				},
			},
		},
		{
			name: "no links in post",
			in:   ">>20",
			out:  "<span><em>>>20</em><br></span>",
		},
		{
			name: "1 invalid link",
			in:   ">>20",
			out:  "<span><em>>>20</em><br></span>",
			links: common.LinkMap{
				21: {
					Board: "a",
					OP:    21,
				},
			},
		},
		{
			name: "valid link",
			in:   ">>21",
			out:  `<span><em><a class="history" data-id="21" href="#p21">>>21</a></em><br></span>`,
			op:   20,
			links: common.LinkMap{
				21: {
					Board: "a",
					OP:    20,
				},
			},
		},
		{
			name: "valid link with extra quotes",
			in:   ">>>>21",
			out:  `<span><em>>><a class="history" data-id="21" href="#p21">>>21</a></em><br></span>`,
			op:   20,
			links: common.LinkMap{
				21: {
					Board: "a",
					OP:    20,
				},
			},
		},
		{
			name: "valid cross-thread link",
			in:   ">>21",
			out:  `<span><em><a class="history" data-id="21" href="/a/22#p21">>>>/a/21</a></em><br></span>`,
			op:   20,
			links: common.LinkMap{
				21: {
					Board: "a",
					OP:    22,
				},
			},
		},
		{
			name: "invalid reference",
			in:   ">>>/fufufu/",
			out:  `<span><em>>>>/fufufu/</em><br></span>`,
		},
		{
			name: "link reference",
			in:   ">>>/4chan/",
			out:  `<span><em><a href="http://4chan.org" target="_blank">&gt;&gt;&gt;/4chan/</a></em><br></span>`,
		},
		{
			name: "board reference",
			in:   ">>>/a/",
			out:  `<span><em><a href="/a/" target="_blank">&gt;&gt;&gt;/a/</a></em><br></span>`,
		},
		{
			name: "reference with extra quotes",
			in:   ">>>>>/a/",
			out:  `<span><em>>><a href="/a/" target="_blank">&gt;&gt;&gt;/a/</a></em><br></span>`,
		},
		{
			name: "HTTP URL",
			in:   "http://4chan.org",
			out:  `<span><a href="http://4chan.org" target="_blank">http://4chan.org</a><br></span>`,
		},
		{
			name: "HTTPS URL",
			in:   "https://4chan.org",
			out:  `<span><a href="https://4chan.org" target="_blank">https://4chan.org</a><br></span>`,
		},
		{
			name: "magnet URL",
			in:   "magnet:?xt=urn:btih:c12fe1",
			out:  `<span><a href="magnet:?xt=urn:btih:c12fe1">magnet:?xt=urn:btih:c12fe1</a><br></span>`,
		},
		{
			name: "XSS inject URL",
			in:   "http://4chan.org<>",
			out:  `<span>http://4chan.org&lt;&gt;<br></span>`,
		},
		{
			name: "escape generic text",
			in:   "<>&",
			out:  "<span>&lt;&gt;&amp;<br></span>",
		},
		{
			name: "youtube embed",
			in:   "https://www.youtube.com/watch?v=z0f4Wgi94eo",
			out:  "<span><em><a class=\"embed\" target=\"_blank\" data-type=\"0\" href=\"https://www.youtube.com/watch?v=z0f4Wgi94eo\">[Youtube] ???</a></em><br></span>",
		},
		{
			name: "youtu.be embed",
			in:   "https://youtu.be/z0f4Wgi94eo",
			out:  "<span><em><a class=\"embed\" target=\"_blank\" data-type=\"0\" href=\"https://youtu.be/z0f4Wgi94eo\">[Youtube] ???</a></em><br></span>",
		},
		{
			name: "soundcloud embed",
			in:   "https://soundcloud.com/cd_oblongar",
			out:  "<span><em><a class=\"embed\" target=\"_blank\" data-type=\"1\" href=\"https://soundcloud.com/cd_oblongar\">[SoundCloud] ???</a></em><br></span>",
		},
		{
			name: "vimeo embed",
			in:   "https://vimeo.com/174312494",
			out:  "<span><em><a class=\"embed\" target=\"_blank\" data-type=\"2\" href=\"https://vimeo.com/174312494\">[Vimeo] ???</a></em><br></span>",
		},
	}

	for i := range cases {
		c := cases[i]
		t.Run(c.name, func(t *testing.T) {
			t.Parallel()

			p := common.Post{
				Body:     c.in,
				Editing:  c.editing,
				Links:    c.links,
				Commands: c.commands,
			}

			buf := quicktemplate.AcquireByteBuffer()
			defer quicktemplate.ReleaseByteBuffer(buf)
			w := quicktemplate.AcquireWriter(buf)
			defer quicktemplate.ReleaseWriter(w)

			streambody(w, p, c.op)

			if s := string(buf.B); s != c.out {
				LogUnexpected(t, c.out, s)
			}
		})
	}
}
