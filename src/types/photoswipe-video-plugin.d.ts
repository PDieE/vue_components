declare module 'photoswipe-video-plugin' {
  import type PhotoSwipeLightbox from 'photoswipe/lightbox'

  export default class PhotoSwipeVideoPlugin {
    constructor(
      lightbox: PhotoSwipeLightbox,
      options?: {
        autoplay?: boolean
        videoAttributes?: Record<string, string>
        preventDragOffset?: number
      },
    )
  }
}
