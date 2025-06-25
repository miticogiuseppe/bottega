import { Fragment } from 'react';
import Lightbox, { PluginProps } from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";

import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export const Lightboxcomponent = ({ open, index, scroll = true, on = true, style = {}, mainClass = '', portals = false, Controller, plugins = [Fullscreen, Slideshow, Thumbnails, Zoom] , label = { zoomIn: 'Zoom In', zoomOut: 'Zoom Out' }, toolbar = true, Carousel = true, animation = 'fade', slides, close, zoom = { maxZoomPixelRatio: 10, scrollToZoom: true }
}) => {
  return (
    <Fragment>
      <Lightbox
        open={open}
        index={index}
        // noScroll={!scroll}
        on={on}
        styles={style}
        controller={Controller}
        portal={portals}
        className={mainClass}
        plugins={plugins}
        zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
        labels={label}
        toolbar={toolbar}
        carousel={Carousel}
        animation={animation}
        slides={slides}
        close={close}
      />
    </Fragment>
  );
};
