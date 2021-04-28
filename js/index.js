// Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
// new Vue({
//   el: '#app',
//   data() {
//     return {
//     }
//   },
//   computed: {
//     width() {
//       return `50%`
//     }
//   },
//   created() {
//   },
//   methods: {
//   },
// })
class PoorVideo {
  constructor (options) {
    const { el } = options
    if (!el) {
      throw Error(`el 属性必填，且必须是 DOM 的 id 属性`)
    }
    this.timeStp = +new Date()
    this._init(options)
    this._initProgress()
  }
  play () {
    const btn = document.querySelector('.poor-video-play-pause')
    btn.setAttribute('video-state', 'p')
    this.media.play()
  }
  pause () {
    const btn = document.querySelector('.poor-video-play-pause')
    btn.setAttribute('video-state', 'u')
    this.media.pause()
  }
  playPause () {
    const media = this.media
    if (media.paused) {
      this.play()
    } else {
      this.pause()
    }
  }
  _bindEvents () {
    const media = this.media
    const duration = +Math.floor(media.duration)
    const videoContain = this.videoContain
    function format (time) {
      var minutes = Math.floor(time / 60)
      var seconds = Math.floor(time - minutes * 60)
      var minuteValue
      var secondValue

      if (minutes < 10) {
        minuteValue = '0' + minutes
      } else {
        minuteValue = minutes
      }

      if (seconds < 10) {
        secondValue = '0' + seconds
      } else {
        secondValue = seconds
      }
      return `${minuteValue}:${secondValue}`
    }
    function setTime () {
      format(media.currentTime)
      var mediaTime = `${format(media.currentTime)}/${format(duration)}`
      const __progressing = document.querySelector('#__progressing')
      __progressing.style.width = `${(media.currentTime / media.duration) *
        100}%`
    }
    media.addEventListener('timeupdate', setTime)
    media.addEventListener('ended', () => {
      this.pause()
    })
    videoContain.addEventListener('click', e => {
      if (e.target.classList.contains('poor-video-control-full')) {
        if (!document.fullscreenElement) {
          videoContain.requestFullscreen()
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          }
        }
      }
      if (e.target.classList.contains('poor-video-play-pause')) {
        this.playPause()
      }
    })
  }
  _init (options) {
    const { el } = options
    const dom = document.querySelector(el)
    if (!dom) {
      throw Error(`未获取到对应 DOM，请检查对应属性是否存在。`)
    }
    const video = this._initVideo(options)
    dom.appendChild(video)
  }
  _initVideo ({
    width = '100%',
    height = '100%',
    src,
    autoplay = false,
    controls = false,
    loop = false,
    muted = false,
    poster = ''
  }) {
    const videoContain = document.createElement('div')
    videoContain.classList.add('poor-video')
    this.videoContain = videoContain
    Object.assign(videoContain.style, {
      width,
      height,
      backgroundColor: '#000000',
      position: 'relative',
      overflow: 'hidden'
    })
    const id = `__PoorVideo${this.timeStp}`
    this.videoId = id
    const video = document.createElement('video')
    video.id = id
    video.autoplay = autoplay
    video.controls = controls
    video.loop = loop
    video.muted = muted
    video.poster = poster
    video.style.width = '100%'
    video.style.height = '100%'
    this.media = video
    const source = document.createElement('source')
    source.src = src
    video.appendChild(source)
    videoContain.appendChild(video)
    const controlBar = this._initControlBar()
    videoContain.appendChild(controlBar)

    video.addEventListener('canplay', () => {
      this._bindEvents()
    })
    return videoContain
  }
  _initControlBar () {
    const bar = document.createElement('div')
    bar.classList.add('poor-video-control-bar')
    Object.assign(bar.style, {
      height: '50px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      position: 'absolute',
      bottom: '0',
      width: '100%'
    })
    bar.innerHTML = `<div class="poor-video-control-bar">
    <div class="progress" id="__progress">
      <div class="progressing" id="__progressing">
        <span id="__point"></span>
      </div>
    </div>
    <div class="control-box">
      <div class="poor-video-play-pause poor-video-control-icon" video-state="u"></div>
      <div class="poor-video-control-tool"></div>
      <div class="poor-video-control-volume poor-video-control-icon"></div>
      <div class="poor-video-control-full poor-video-control-icon"></div>
    </div>
  </div>`
    return bar
  }
  _initProgress () {
    const __progress = document.querySelector('#__progress')
    const __progressWidth = __progress.clientWidth

    const __progressing = document.querySelector('#__progressing')
    const __point = document.querySelector('#__point')

    __progress.addEventListener('click', e => {
      const _width = e.x - __point.offsetWidth / 2
      const progress = _width / __progressWidth
      const media = this.media
      media.currentTime = media.duration * progress
      // __progressing.style.width = `${progress * 100}%`
    })

    document.addEventListener('mousedown', e => {
      if (e.target.id !== '__point') {
        return
      }
      const ele = e.target
      let x0 = e.clientX
      const handleMove = ({ clientX }) => {
        let left = ele.style.left || ele.offsetLeft
        const _width = parseFloat(left, 10) + clientX - x0
        let persent = _width / __progressWidth
        if (persent < 0) persent = 0
        if (persent > 1) persent = 1
        __progressing.style.width = `${persent * 100}%`
        x0 = clientX
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleMove)
      })
    })
  }
}
new PoorVideo({
  el: '#test_video',
  width: '600px',
  height: '400px',
  src:
    'https://mdn.github.io/learning-area/javascript/apis/video-audio/finished/video/sintel-short.mp4'
})
