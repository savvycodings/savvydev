gsap.registerPlugin(ScrollTrigger);

const body = document.querySelector('body');
const intro = document.querySelector('.intro'),
    introCard = intro.querySelectorAll('.intro_card'),
    introMedia = intro.querySelector('.intro_media');

const isMobile = window.matchMedia('(max-width: 769px)');

const init = () => {
    gsap.set(body, { overflow: 'hidden' });
    gsap.set(introCard[0], { scale: 0.6 });

    initLenis();
    initScrollHero();
    initScrollMedia();
};
const initLenis = () => {
    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        // infinite: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
};

//? -----> Awwwards Rebuild part 1
const initScrollHero = () => {
    const tlHero = gsap.timeline({
        defaults: { stagger: 0.08, ease: 'power1.inOut' },
        scrollTrigger: {
            trigger: '.intro_one',
            start: 'top top',
            end: 'center',
            scrub: true,
            pin: true,
            pinSpacing: true,
        },
    });
    tlHero.add('start').to(introCard[0], {
        scale: 1,
    });
};
const initScrollMedia = () => {
    const tlMedia = gsap.timeline({
        scrollTrigger: {
            trigger: intro,
            start: 'center top',
            end: 'bottom bottom',
            scrub: 2,
            pinSpacing: false,
        },
    });
    gsap.set(introMedia, { autoAlpha: 1 });
    tlMedia.to(introMedia, {
        autoAlpha: 0,
    });

    initGalleryText();
};
const initGalleryText = () => {
    const gallery = document.querySelector('.gallery'),
        galleryText = gallery.querySelector('.gallery_text');

    ScrollTrigger.create({
        //-----> Attach the scroll trigger to the gallery container
        trigger: gallery,
        //-----> Pin the gallery text element to the gallery container
        pin: galleryText,
        start: 'top top',
        end: 'bottom bottom',
    });

    const texts = gsap.utils.toArray('.gallery_text_items > h2');
    gsap.set(texts, { y: '200%', autoAlpha: 0 });

    texts.forEach((text, i) => {
        const tlGalleryText = gsap.timeline({
            scrollTrigger: {
                trigger: gallery,
                //-----> Start the animation when the user scrolls over the text title corresponding to the current index
                start: () => `top+=${i * window.innerHeight} top+=60%`,
                //-----> End the animation when the user scrolls past the text title corresponding to the current index
                end: () => `top+=${(i + 1) * window.innerHeight} top`,
                scrub: 2,
            },
        });

        tlGalleryText
            .to(text, {
                y: 0,
                autoAlpha: 1,
            })
            .to(text, {
                y: '-200%',
                autoAlpha: 0,
            });
    });

    initConnection();
};

//? -----> Awwwards Rebuild part 2
const initConnection = () => {
    const connect = document.querySelector('.connect'),
        connectMedia = connect.querySelectorAll('.connect_media');

    connectMedia.forEach((media) => {
        //-----> In order to prevent GSAP from converting percentage values to pixels we also set 'y: 0' for each image element. You can read more about below:
        //-----> Gsap Forum Reference: https://gsap.com/community/forums/topic/28215-prevent-gsap-from-converting-percentage-values-to-pixels/

        media.classList.contains('image--front')
            ? gsap.set(media, { xPercent: -200, y: 0, yPercent: -50 })
            : gsap.set(media, { xPercent: 200, y: 0, yPercent: -50 });
    });
    const tlConnect = gsap.timeline({
        ease: 'none',
        scrollTrigger: {
            trigger: connect,
            start: 'top top',
            end: '+=3000',
            scrub: 1,
            pin: true,
        },
    });
    tlConnect
        .to(connectMedia, {
            xPercent: 0,
        })
        .to(connectMedia, {
            scale: 0.5,
        });

    if (isMobile.matches) return;
    initHorizontal();
};

//? -----> Awwwards Rebuild part 3
const initHorizontal = () => {
    const horizontal = document.querySelector('.horizontal'),
        horizontalVerticalBoxes = horizontal.querySelectorAll('.horizontal_box--vertical');

    const tlHorizontal = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: horizontal,
            start: 'top top',
            //-----> The trigger ends when the user scrolls past the width of the 'horizontal' element
            end: () => '+=' + horizontal.offsetWidth,
            pin: true,
            scrub: 1,
            //-----> Invalidates the timeline on every browser refresh
            invalidateOnRefresh: true,
        },
    });

    tlHorizontal.to('.horizontal_wrapper', {
        //-----> Sets the 'x' position of the wrapper to the negative value of its scroll width minus the document width
        x: () => -(horizontal.scrollWidth - document.documentElement.clientWidth) + 'px',
    });

    gsap.set(horizontalVerticalBoxes, { y: '-25%' });
    tlHorizontal.to(
        horizontalVerticalBoxes,
        {
            y: '25%',
            stagger: 0.02,
        },
        0
    );
};

window.addEventListener('DOMContentLoaded', () => {
    //-----> Check if the media query matches
    if (!isMobile.matches) {
        //-----> Perform desktop-specific initialization
        init();
    } else {
        //-----> Perform mobile-specific initialization
        initLenis();
        initScrollMedia();
    }
});
