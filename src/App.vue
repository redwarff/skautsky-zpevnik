<template>
  <div id="app">
    <router-view/>
    <dialogs-wrapper wrapper-name="default" />
  </div>
</template>

<style lang="scss">
	@import '~bootstrap/scss/bootstrap.scss';

  @font-face {
    font-family: 'themix';
    src: url('https://cdn.skauting.cz/fonts/TheMix_LT_400.eot');
    src: url('https://cdn.skauting.cz/fonts/TheMix_LT_400.eot? #iefix') format('embedded-opentype');
    src: url('https://cdn.skauting.cz/fonts/TheMix_LT_400.woff') format('woff'),
      url('https://cdn.skauting.cz/fonts/TheMix_LT_400.otf') format('opentype'),
      url('https://cdn.skauting.cz/fonts/TheMix_LT_400.svg#themix') format('svg');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'skautbold';
    src: url('https://cdn.skauting.cz/fonts/skaut-bold-webfont.eot');
    src: url('https://cdn.skauting.cz/fonts/skaut-bold-webfont.eot? #iefix') format('embedded-opentype');
    src: url('https://cdn.skauting.cz/fonts/skaut-bold-webfont.woff') format('woff'),
      url('https://cdn.skauting.cz/fonts/skaut-bold-webfont.otf') format('opentype'),
      url('https://cdn.skauting.cz/fonts/skaut-bold-webfont.svg#skautbold') format('svg');
    font-weight: normal;
    font-style: normal;
  }

  body {
      font-family: themix;
  }

  h1, h2, h3, h4, h5, h6 {
      font-family: skautbold; 
  }

  p {
    text-align: justify;
  }

  .psm {
    padding: 5px;
  }

  .navlink {
    width: 100%;
    height: 100%;
  }

  .navlink.active, .navlink.active:hover, .navlink.active:focus {
    color: #555 !important;
    background-color: #e7e7e7 !important;
  }

  .list-item {
    cursor: pointer;
  }

  .list-item:hover {
    background-color: #e7e7e7 !important;
  }
</style>
