// This file is automatically generated by qtc from "article.html".
// See https://github.com/valyala/quicktemplate for details.

//line article.html:1
package templates

//line article.html:1
import (
	qtio422016 "io"

	qt422016 "github.com/valyala/quicktemplate"
)

//line article.html:1
import "fmt"

//line article.html:2
import "strconv"

//line article.html:3
import "github.com/bakape/meguca/common"

//line article.html:4
import "github.com/bakape/meguca/imager/assets"

//line article.html:6
var (
	_ = qtio422016.Copy
	_ = qt422016.AcquireByteBuffer
)

//line article.html:6
func streamrenderArticle(qw422016 *qt422016.Writer, p common.Post, op uint64, omit, imageOmit int, subject, root string) {
	//line article.html:7
	id := strconv.FormatUint(p.ID, 10)

	//line article.html:7
	qw422016.N().S(`<article id="p`)
	//line article.html:8
	qw422016.N().S(id)
	//line article.html:8
	qw422016.N().S(`" class="glass`)
	//line article.html:8
	if p.Editing {
		//line article.html:8
		qw422016.N().S(` `)
		//line article.html:8
		qw422016.N().S(`editing`)
		//line article.html:8
	}
	//line article.html:8
	qw422016.N().S(`"><header class="spaced">`)
	//line article.html:10
	if subject != "" {
		//line article.html:10
		qw422016.N().S(`<h3>「`)
		//line article.html:12
		qw422016.E().S(subject)
		//line article.html:12
		qw422016.N().S(`」</h3>`)
		//line article.html:14
	}
	//line article.html:14
	qw422016.N().S(`<b class="name"`)
	//line article.html:15
	if p.Auth != "" {
		//line article.html:15
		qw422016.N().S(` `)
		//line article.html:15
		qw422016.N().S(`class="admin"`)
		//line article.html:15
	}
	//line article.html:15
	qw422016.N().S(`>`)
	//line article.html:16
	if p.Name != "" || p.Trip == "" {
		//line article.html:17
		if p.Name != "" {
			//line article.html:18
			qw422016.E().S(p.Name)
			//line article.html:19
		} else {
			//line article.html:19
			qw422016.N().S(`Anonymous`)
			//line article.html:21
		}
		//line article.html:22
		if p.Trip != "" {
			//line article.html:23
			qw422016.N().S(` `)
			//line article.html:24
		}
		//line article.html:25
	}
	//line article.html:26
	if p.Trip != "" {
		//line article.html:26
		qw422016.N().S(`<code>!`)
		//line article.html:28
		qw422016.E().S(p.Trip)
		//line article.html:28
		qw422016.N().S(`</code>`)
		//line article.html:30
	}
	//line article.html:31
	if p.Auth != "" {
		//line article.html:31
		qw422016.N().S(`##`)
		//line article.html:32
		qw422016.N().S(` `)
		//line article.html:32
		qw422016.E().S(p.Auth)
		//line article.html:33
	}
	//line article.html:33
	qw422016.N().S(`</b><time>`)
	//line article.html:36
	qw422016.N().S(formatTime(p.Time))
	//line article.html:36
	qw422016.N().S(`</time><nav><a href="#p`)
	//line article.html:39
	qw422016.N().S(id)
	//line article.html:39
	qw422016.N().S(`">No.</a><a class="quote" href="#p`)
	//line article.html:42
	qw422016.N().S(id)
	//line article.html:42
	qw422016.N().S(`">`)
	//line article.html:43
	qw422016.N().S(id)
	//line article.html:43
	qw422016.N().S(`</a></nav><a class="control"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 0l-1.5 1.5 4 4 4-4-1.5-1.5-2.5 2.5-2.5-2.5z" transform="translate(0 1)" /></svg></a></header>`)
	//line article.html:52
	var src string

	//line article.html:53
	if p.Image != nil {
		//line article.html:54
		img := *p.Image

		//line article.html:55
		src = assets.SourcePath(img.FileType, img.SHA1)

		//line article.html:56
		ISSrc := root + src

		//line article.html:56
		qw422016.N().S(`<figcaption class="spaced"><a class="image-toggle act" hidden></a><span class="spaced image-search-container"><a class="image-search google" target="_blank" rel="nofollow" href="https://www.google.com/searchbyimage?image_url=`)
		//line article.html:60
		qw422016.N().S(ISSrc)
		//line article.html:60
		qw422016.N().S(`">G</a><a class="image-search iqdb" target="_blank" rel="nofollow" href="http://iqdb.org/?url=`)
		//line article.html:63
		qw422016.N().S(ISSrc)
		//line article.html:63
		qw422016.N().S(`">Iq</a><a class="image-search saucenao" target="_blank" rel="nofollow" href="http://saucenao.com/search.php?db=999&url=`)
		//line article.html:66
		qw422016.N().S(ISSrc)
		//line article.html:66
		qw422016.N().S(`">Sn</a><a class="image-search desustorage" target="_blank" rel="nofollow" href="https://desuarchive.org/_/search/image/`)
		//line article.html:69
		qw422016.N().S(img.MD5)
		//line article.html:69
		qw422016.N().S(`">Ds</a><a class="image-search exhentai" target="_blank" rel="nofollow" href="http://exhentai.org/?fs_similar=1&fs_exp=1&f_shash=`)
		//line article.html:72
		qw422016.N().S(img.SHA1)
		//line article.html:72
		qw422016.N().S(`">Ex</a></span><span>(`)
		//line article.html:78
		if img.Audio {
			//line article.html:78
			qw422016.N().S(`♫,`)
			//line article.html:79
			qw422016.N().S(` `)
			//line article.html:80
		}
		//line article.html:81
		if img.Length != 0 {
			//line article.html:82
			l := img.Length

			//line article.html:83
			if l < 60 {
				//line article.html:84
				qw422016.N().S(fmt.Sprintf("0:%02d", l))
				//line article.html:85
			} else {
				//line article.html:86
				min := l / 6

				//line article.html:87
				qw422016.N().S(fmt.Sprintf("%02d:%02d", min, l-min))
				//line article.html:88
			}
			//line article.html:88
			qw422016.N().S(`,`)
			//line article.html:89
			qw422016.N().S(` `)
			//line article.html:90
		}
		//line article.html:91
		if img.APNG {
			//line article.html:91
			qw422016.N().S(`APNG,`)
			//line article.html:92
			qw422016.N().S(` `)
			//line article.html:93
		}
		//line article.html:94
		qw422016.N().S(readableFileSize(img.Size))
		//line article.html:94
		qw422016.N().S(`,`)
		//line article.html:94
		qw422016.N().S(` `)
		//line article.html:95
		qw422016.N().S(strconv.FormatUint(uint64(img.Dims[0]), 10))
		//line article.html:95
		qw422016.N().S(`x`)
		//line article.html:97
		qw422016.N().S(strconv.FormatUint(uint64(img.Dims[1]), 10))
		//line article.html:97
		qw422016.N().S(`)</span>`)
		//line article.html:100
		name := imageName(img.FileType, img.Name)

		//line article.html:100
		qw422016.N().S(`<a href="`)
		//line article.html:101
		qw422016.N().S(src)
		//line article.html:101
		qw422016.N().S(`" download="`)
		//line article.html:101
		qw422016.N().S(name)
		//line article.html:101
		qw422016.N().S(`">`)
		//line article.html:102
		qw422016.N().S(name)
		//line article.html:102
		qw422016.N().S(`</a></figcaption>`)
		//line article.html:105
	}
	//line article.html:105
	qw422016.N().S(`<div class="post-container">`)
	//line article.html:107
	if p.Image != nil {
		//line article.html:108
		img := *p.Image

		//line article.html:108
		qw422016.N().S(`<figure><a target="_blank" href="`)
		//line article.html:110
		qw422016.N().S(src)
		//line article.html:110
		qw422016.N().S(`">`)
		//line article.html:111
		if img.Spoiler {
			//line article.html:111
			qw422016.N().S(`<!-- TODO: board-specific server-side spoiler rendering --><img src="/assets/spoil/default.jpg" width="125" height="125">`)
			//line article.html:114
		} else {
			//line article.html:115
			w, h := correctDims(subject != "", img.Dims[2], img.Dims[3])

			//line article.html:115
			qw422016.N().S(`<img src="`)
			//line article.html:116
			qw422016.N().S(assets.ThumbPath(img.FileType, img.ThumbType, img.SHA1))
			//line article.html:116
			qw422016.N().S(`" width="`)
			//line article.html:116
			qw422016.N().S(w)
			//line article.html:116
			qw422016.N().S(`" height="`)
			//line article.html:116
			qw422016.N().S(h)
			//line article.html:116
			qw422016.N().S(`">`)
			//line article.html:117
		}
		//line article.html:117
		qw422016.N().S(`</a></figure>`)
		//line article.html:120
	}
	//line article.html:120
	qw422016.N().S(`<blockquote>`)
	//line article.html:122
	streambody(qw422016, p, op)
	//line article.html:122
	qw422016.N().S(`</blockquote></div>`)
	//line article.html:125
	if omit != 0 {
		//line article.html:125
		qw422016.N().S(`<span class="omit" data-omit="`)
		//line article.html:126
		qw422016.N().D(omit)
		//line article.html:126
		qw422016.N().S(`" data-image-omit="`)
		//line article.html:126
		qw422016.N().D(imageOmit)
		//line article.html:126
		qw422016.N().S(`">`)
		//line article.html:127
		qw422016.N().D(omit)
		//line article.html:127
		qw422016.N().S(` `)
		//line article.html:127
		qw422016.N().S(`post`)
		//line article.html:127
		if omit > 1 {
			//line article.html:127
			qw422016.N().S(`s`)
			//line article.html:127
		}
		//line article.html:128
		qw422016.N().S(` `)
		//line article.html:128
		qw422016.N().S(`and`)
		//line article.html:128
		qw422016.N().S(` `)
		//line article.html:128
		qw422016.N().D(imageOmit)
		//line article.html:129
		qw422016.N().S(` `)
		//line article.html:129
		qw422016.N().S(`image`)
		//line article.html:129
		if imageOmit > 1 {
			//line article.html:129
			qw422016.N().S(`s`)
			//line article.html:129
		}
		//line article.html:129
		qw422016.N().S(`omitted`)
		//line article.html:130
		qw422016.N().S(` `)
		//line article.html:130
		qw422016.N().S(`<span class="act"><a href="`)
		//line article.html:132
		qw422016.N().S(strconv.FormatUint(op, 10))
		//line article.html:132
		qw422016.N().S(`" class="history">See All</a></span></span>`)
		//line article.html:137
	}
	//line article.html:138
	if p.Backlinks != nil {
		//line article.html:138
		qw422016.N().S(`<small class="spaced">`)
		//line article.html:140
		for id, link := range p.Backlinks {
			//line article.html:141
			streampostLink(qw422016, id, link.OP, link.Board, link.OP != op)
			//line article.html:142
		}
		//line article.html:142
		qw422016.N().S(`</small>`)
		//line article.html:144
	}
	//line article.html:144
	qw422016.N().S(`</article>`)
//line article.html:146
}

//line article.html:146
func writerenderArticle(qq422016 qtio422016.Writer, p common.Post, op uint64, omit, imageOmit int, subject, root string) {
	//line article.html:146
	qw422016 := qt422016.AcquireWriter(qq422016)
	//line article.html:146
	streamrenderArticle(qw422016, p, op, omit, imageOmit, subject, root)
	//line article.html:146
	qt422016.ReleaseWriter(qw422016)
//line article.html:146
}

//line article.html:146
func renderArticle(p common.Post, op uint64, omit, imageOmit int, subject, root string) string {
	//line article.html:146
	qb422016 := qt422016.AcquireByteBuffer()
	//line article.html:146
	writerenderArticle(qb422016, p, op, omit, imageOmit, subject, root)
	//line article.html:146
	qs422016 := string(qb422016.B)
	//line article.html:146
	qt422016.ReleaseByteBuffer(qb422016)
	//line article.html:146
	return qs422016
//line article.html:146
}
