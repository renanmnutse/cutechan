// This file is automatically generated by qtc from "board.html".
// See https://github.com/valyala/quicktemplate for details.

//line board.html:1
package templates

//line board.html:1
import (
	qtio422016 "io"

	qt422016 "github.com/valyala/quicktemplate"
)

//line board.html:1
import "strconv"

//line board.html:2
import "github.com/bakape/meguca/config"

//line board.html:3
import "github.com/bakape/meguca/common"

//line board.html:4
import "github.com/bakape/meguca/lang"

//line board.html:5
import "github.com/bakape/meguca/imager/assets"

//line board.html:7
var (
	_ = qtio422016.Copy
	_ = qt422016.AcquireByteBuffer
)

//line board.html:7
func streamrenderBoard(qw422016 *qt422016.Writer, threadHTML []byte, id, title string, conf config.BoardConfContainer, ln lang.Pack) {
	//line board.html:13
	qw422016.N().S(`<h1 id="page-title">`)
	//line board.html:15
	qw422016.N().S(title)
	//line board.html:15
	qw422016.N().S(`</h1><span class="aside-container"><aside id="thread-form-container" class="glass"><span class="act"><a class="new-thread-button">`)
	//line board.html:21
	qw422016.N().S(ln.UI["newThread"])
	//line board.html:21
	qw422016.N().S(`</a></span><form id="new-thread-form" action="/createThread" class="hidden">`)
	//line board.html:25
	if id == "all" {
		//line board.html:25
		qw422016.N().S(`<select name="board" required>`)
		//line board.html:27
		for _, b := range config.GetBoardTitles() {
			//line board.html:27
			qw422016.N().S(`<option value="`)
			//line board.html:28
			qw422016.N().S(b.ID)
			//line board.html:28
			qw422016.N().S(`">`)
			//line board.html:29
			streamformatTitle(qw422016, b.ID, b.Title)
			//line board.html:29
			qw422016.N().S(`</option>`)
			//line board.html:31
		}
		//line board.html:31
		qw422016.N().S(`</select><br>`)
		//line board.html:34
	}
	//line board.html:34
	qw422016.N().S(`<input name="subject" placeholder="`)
	//line board.html:35
	qw422016.N().S(ln.UI["subject"])
	//line board.html:35
	qw422016.N().S(`" required type="text" maxlength="100"><br><noscript>`)
	//line board.html:38
	for _, s := range specs["noscriptPostCreation"] {
		//line board.html:39
		streaminput(qw422016, s, ln)
		//line board.html:39
		qw422016.N().S(`<br>`)
		//line board.html:41
	}
	//line board.html:41
	qw422016.N().S(`</noscript>`)
	//line board.html:43
	if id == "all" || !conf.TextOnly {
		//line board.html:43
		qw422016.N().S(`<span class="upload-container"><span data-id="spoiler"><label><input type="checkbox" name="spoiler">`)
		//line board.html:48
		qw422016.N().S(ln.Common.Posts["spoiler"])
		//line board.html:48
		qw422016.N().S(`</label></span><strong class="upload-status"></strong><br><input type="file" name="image" accept="image/png, image/gif, image/jpeg, video/webm, video/ogg, audio/ogg, application/ogg, video/mp4, audio/mp4, audio/mp3, application/zip, application/x-7z-compressed, application/x-xz, application/x-gzip"><br></span>`)
		//line board.html:56
	}
	//line board.html:57
	streamcaptcha(qw422016, "new-thread", ln.UI)
	//line board.html:57
	qw422016.N().S(`<input type="submit" value="`)
	//line board.html:58
	qw422016.N().S(ln.UI["submit"])
	//line board.html:58
	qw422016.N().S(`"><input type="button" name="cancel" value="`)
	//line board.html:59
	qw422016.N().S(ln.UI["cancel"])
	//line board.html:59
	qw422016.N().S(`"></form></aside><aside id="refresh" class="act glass"><a>`)
	//line board.html:64
	qw422016.N().S(ln.Common.UI["refresh"])
	//line board.html:64
	qw422016.N().S(`</a></aside>`)
	//line board.html:67
	streamhoverReveal(qw422016, conf.Notice, ln.UI["showNotice"])
	//line board.html:68
	streamhoverReveal(qw422016, conf.Rules, ln.UI["rules"])
	//line board.html:68
	qw422016.N().S(`<span id="catalog-controls" class="margin-spaced"><input type="text" name="search" placeholder="`)
	//line board.html:70
	qw422016.N().S(ln.UI["search"])
	//line board.html:70
	qw422016.N().S(`" title="`)
	//line board.html:70
	qw422016.N().S(ln.UI["searchTooltip"])
	//line board.html:70
	qw422016.N().S(`"><select name="sortMode">`)
	//line board.html:72
	for i, s := range [...]string{"lastReply", "creation", "replyCount", "fileCount"} {
		//line board.html:72
		qw422016.N().S(`<option value="`)
		//line board.html:73
		qw422016.N().S(s)
		//line board.html:73
		qw422016.N().S(`">`)
		//line board.html:74
		qw422016.N().S(ln.SortModes[i])
		//line board.html:74
		qw422016.N().S(`</option>`)
		//line board.html:76
	}
	//line board.html:76
	qw422016.N().S(`</select></span></span><noscript>TODO: Noscript thread creation</noscript><hr><div id="catalog">`)
	//line board.html:83
	qw422016.N().Z(threadHTML)
	//line board.html:83
	qw422016.N().S(`<script id="board-configs" type="application/json">`)
	//line board.html:85
	qw422016.N().Z(conf.JSON)
	//line board.html:85
	qw422016.N().S(`</script></div><hr>`)
//line board.html:89
}

//line board.html:89
func writerenderBoard(qq422016 qtio422016.Writer, threadHTML []byte, id, title string, conf config.BoardConfContainer, ln lang.Pack) {
	//line board.html:89
	qw422016 := qt422016.AcquireWriter(qq422016)
	//line board.html:89
	streamrenderBoard(qw422016, threadHTML, id, title, conf, ln)
	//line board.html:89
	qt422016.ReleaseWriter(qw422016)
//line board.html:89
}

//line board.html:89
func renderBoard(threadHTML []byte, id, title string, conf config.BoardConfContainer, ln lang.Pack) string {
	//line board.html:89
	qb422016 := qt422016.AcquireByteBuffer()
	//line board.html:89
	writerenderBoard(qb422016, threadHTML, id, title, conf, ln)
	//line board.html:89
	qs422016 := string(qb422016.B)
	//line board.html:89
	qt422016.ReleaseByteBuffer(qb422016)
	//line board.html:89
	return qs422016
//line board.html:89
}

// CatalogThreads renders thread content for a catalog page. Separate function to
// allow caching of generated posts.

//line board.html:93
func StreamCatalogThreads(qw422016 *qt422016.Writer, b common.Board) {
	//line board.html:94
	for _, t := range b {
		//line board.html:95
		idStr := strconv.FormatUint(t.ID, 10)

		//line board.html:96
		postCtr := strconv.FormatUint(uint64(t.PostCtr), 10)

		//line board.html:97
		imgCtr := strconv.FormatUint(uint64(t.ImageCtr), 10)

		//line board.html:97
		qw422016.N().S(`<article id="p`)
		//line board.html:98
		qw422016.N().S(idStr)
		//line board.html:98
		qw422016.N().S(`" class="glass" data-replyTime="`)
		//line board.html:98
		qw422016.N().S(strconv.FormatInt(t.ReplyTime, 10))
		//line board.html:98
		qw422016.N().S(`" data-time="`)
		//line board.html:98
		qw422016.N().S(strconv.FormatInt(t.Time, 10))
		//line board.html:98
		qw422016.N().S(`" data-postCtr="`)
		//line board.html:98
		qw422016.N().S(postCtr)
		//line board.html:98
		qw422016.N().S(`" data-imageCtr="`)
		//line board.html:98
		qw422016.N().S(imgCtr)
		//line board.html:98
		qw422016.N().S(`">`)
		//line board.html:99
		if t.Image != nil {
			//line board.html:99
			qw422016.N().S(`<figure>`)
			//line board.html:101
			img := *t.Image

			//line board.html:101
			qw422016.N().S(`<a class="history" href="/`)
			//line board.html:102
			qw422016.N().S(t.Board)
			//line board.html:102
			qw422016.N().S(`/`)
			//line board.html:102
			qw422016.N().S(idStr)
			//line board.html:102
			qw422016.N().S(`">`)
			//line board.html:103
			if img.Spoiler {
				//line board.html:103
				qw422016.N().S(`<img src="/assets/spoil/default.jpg" width="150" height="150" class="expanded">`)
				//line board.html:105
			} else {
				//line board.html:105
				qw422016.N().S(`<img width="`)
				//line board.html:106
				qw422016.N().S(strconv.FormatUint(uint64(img.Dims[2]), 10))
				//line board.html:106
				qw422016.N().S(`" height="`)
				//line board.html:106
				qw422016.N().S(strconv.FormatUint(uint64(img.Dims[3]), 10))
				//line board.html:106
				qw422016.N().S(`" class="expanded" src="`)
				//line board.html:106
				qw422016.N().S(assets.ThumbPath(img.FileType, img.ThumbType, img.SHA1))
				//line board.html:106
				qw422016.N().S(`">`)
				//line board.html:107
			}
			//line board.html:107
			qw422016.N().S(`</a></figure>`)
			//line board.html:110
		}
		//line board.html:110
		qw422016.N().S(`<small class="spaced thread-links"><b class="board">/`)
		//line board.html:113
		qw422016.N().S(t.Board)
		//line board.html:113
		qw422016.N().S(`/</b><span class="counters">`)
		//line board.html:116
		qw422016.N().S(postCtr)
		//line board.html:116
		qw422016.N().S(`/`)
		//line board.html:116
		qw422016.N().S(imgCtr)
		//line board.html:116
		qw422016.N().S(`</span>`)
		//line board.html:118
		if t.Image == nil {
			//line board.html:118
			qw422016.N().S(`<span class="act"><a class="history expand-link" href="/`)
			//line board.html:120
			qw422016.N().S(t.Board)
			//line board.html:120
			qw422016.N().S(`/`)
			//line board.html:120
			qw422016.N().S(idStr)
			//line board.html:120
			qw422016.N().S(`">Expand</a></span>`)
			//line board.html:124
		}
		//line board.html:124
		qw422016.N().S(`<span class="act"><a class="history lastN-link" href="/`)
		//line board.html:126
		qw422016.N().S(t.Board)
		//line board.html:126
		qw422016.N().S(`/`)
		//line board.html:126
		qw422016.N().S(idStr)
		//line board.html:126
		qw422016.N().S(`?last=100">Last 100</a></span></small><br><h3>「`)
		//line board.html:133
		qw422016.E().S(t.Subject)
		//line board.html:133
		qw422016.N().S(`」</h3></article>`)
		//line board.html:136
	}
//line board.html:137
}

//line board.html:137
func WriteCatalogThreads(qq422016 qtio422016.Writer, b common.Board) {
	//line board.html:137
	qw422016 := qt422016.AcquireWriter(qq422016)
	//line board.html:137
	StreamCatalogThreads(qw422016, b)
	//line board.html:137
	qt422016.ReleaseWriter(qw422016)
//line board.html:137
}

//line board.html:137
func CatalogThreads(b common.Board) string {
	//line board.html:137
	qb422016 := qt422016.AcquireByteBuffer()
	//line board.html:137
	WriteCatalogThreads(qb422016, b)
	//line board.html:137
	qs422016 := string(qb422016.B)
	//line board.html:137
	qt422016.ReleaseByteBuffer(qb422016)
	//line board.html:137
	return qs422016
//line board.html:137
}

// Notice widget, that reveals text on hover

//line board.html:140
func streamhoverReveal(qw422016 *qt422016.Writer, text, label string) {
	//line board.html:141
	if text == "" {
		//line board.html:142
		return
		//line board.html:143
	}
	//line board.html:143
	qw422016.N().S(`<aside class="glass hover-reveal"><span class="act">`)
	//line board.html:146
	qw422016.N().S(label)
	//line board.html:146
	qw422016.N().S(`</span><span class="popup-menu glass">`)
	//line board.html:149
	qw422016.E().S(text)
	//line board.html:149
	qw422016.N().S(`</span></aside>`)
//line board.html:152
}

//line board.html:152
func writehoverReveal(qq422016 qtio422016.Writer, text, label string) {
	//line board.html:152
	qw422016 := qt422016.AcquireWriter(qq422016)
	//line board.html:152
	streamhoverReveal(qw422016, text, label)
	//line board.html:152
	qt422016.ReleaseWriter(qw422016)
//line board.html:152
}

//line board.html:152
func hoverReveal(text, label string) string {
	//line board.html:152
	qb422016 := qt422016.AcquireByteBuffer()
	//line board.html:152
	writehoverReveal(qb422016, text, label)
	//line board.html:152
	qs422016 := string(qb422016.B)
	//line board.html:152
	qt422016.ReleaseByteBuffer(qb422016)
	//line board.html:152
	return qs422016
//line board.html:152
}
