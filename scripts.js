$(document).ready(function () {
  function createStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<img src="images/star_on.png" alt="star on" width="15px">';
      } else {
        stars += '<img src="images/star_off.png" alt="star off" width="15px">';
      }
    }
    return stars;
  }

  function createCard(item) {
    return `
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card">
                    <img src="${
                      item.thumb_url
                    }" class="card-img-top" alt="Video thumbnail">
                    <div class="card-img-overlay text-center">
                        <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${
                          item.title
                        }</h5>
                        <p class="card-text text-muted">${item.sub_title}</p>
                        <div class="creator d-flex align-items-center">
                            <img src="${
                              item.author_pic_url
                            }" alt="Creator" width="30px" class="rounded-circle">
                            <h6 class="pl-3 m-0 main-color">${item.author}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                            <div class="rating">${createStars(item.star)}</div>
                            <span class="main-color">${item.duration}</span>
                        </div>
                    </div>
                </div>
            </div>`;
  }

  function createCourseCard(item) {
    const description =
      item.sub_title ||
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";
    return `
            <div class="col-12 col-sm-6 col-md-3">
                <div class="card">
                    <img src="${
                      item.thumb_url
                    }" class="card-img-top" alt="Video thumbnail">
                    <div class="card-img-overlay text-center">
                        <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${
                          item.title
                        }</h5>
                        <p class="card-text text-muted">${description}</p>
                        <div class="creator d-flex align-items-center">
                            <img src="${
                              item.author_pic_url
                            }" alt="Creator" width="30px" class="rounded-circle">
                            <h6 class="pl-3 m-0 main-color">${item.author}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                            <div class="rating">${createStars(item.star)}</div>
                            <span class="main-color">${item.duration}</span>
                        </div>
                    </div>
                </div>`;
  }

  function loadCourses(params = {}) {
    const coursesSection = $(".results .row");
    const videoCount = $(".video-count");
    coursesSection.html('<div class="loader"></div>');

    $.ajax({
      url: "https://smileschool-api.hbtn.info/courses",
      type: "GET",
      data: params,
      success: function (data) {
        coursesSection.empty();
        videoCount.text(`${data.courses.length} videos`);

        data.courses.forEach((course) => {
          coursesSection.append(createCourseCard(course));
        });
      },
    });
  }

  function populateDropdowns(response) {
    const sortLabels = {
      most_popular: "Most Popular",
      most_recent: "Most Recent",
      most_viewed: "Most Viewed",
    };

    const topicDropdown = $(".box2 .dropdown-menu").empty();
    response.topics.forEach((topic) => {
      topicDropdown.append(
        `<a class="dropdown-item" href="#" data-value="${topic}">${topic}</a>`
      );
    });

    const sortDropdown = $(".box3 .dropdown-menu").empty();
    response.sorts.forEach((sortKey) => {
      const sortLabel = sortLabels[sortKey] || sortKey;
      sortDropdown.append(
        `<a class="dropdown-item" href="#" data-value="${sortKey}">${sortLabel}</a>`
      );
    });
  }

  function initCourses() {
    $.ajax({
      url: "https://smileschool-api.hbtn.info/courses",
      type: "GET",
      success: function (response) {
        populateDropdowns(response);

        const defaultParams = {
          q: response.q,
          topic: response.topics[0],
          sort: response.sorts[0],
        };

        $(".search-text-area").val(response.q);
        loadCourses(defaultParams);

        $(".search-text-area").on("input", function () {
          defaultParams.q = $(this).val();
          loadCourses(defaultParams);
        });

        $(".box2 .dropdown-menu").on("click", "a", function () {
          defaultParams.topic = $(this).data("value");
          $(".box2 .dropdown-toggle span").text($(this).text());
          loadCourses(defaultParams);
        });

        $(".box3 .dropdown-menu").on("click", "a", function () {
          defaultParams.sort = $(this).data("value");
          $(".box3 .dropdown-toggle span").text($(this).text());
          loadCourses(defaultParams);
        });
      },
    });
  }

  function loadQuotes() {
    const quotesCarousel = $("#carouselExampleControls .carousel-inner");
    quotesCarousel.html('<div class="loader"></div>');

    $.ajax({
      url: "https://smileschool-api.hbtn.info/quotes",
      type: "GET",
      success: function (data) {
        quotesCarousel.empty();

        data.forEach((quote, index) => {
          quotesCarousel.append(`
                        <div class="carousel-item ${
                          index === 0 ? "active" : ""
                        }">
                            <div class="row mx-auto align-items-center">
                                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                                    <img src="${
                                      quote.pic_url
                                    }" class="d-block align-self-center" alt="Profile ${
            index + 1
          }">
                                </div>
                                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                                    <div class="quote-text">
                                        <p class="text-white">${quote.text}</p>
                                        <h4 class="text-white font-weight-bold">${
                                          quote.name
                                        }</h4>
                                        <p class="text-white">${quote.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`);
        });

        $("#carouselExampleControls").carousel({
          interval: false,
        });
      },
    });
  }

  function loadPopularTutorials() {
    const tutorialsCarousel = $("#carouselExampleControls2 .carousel-inner");
    tutorialsCarousel.html('<div class="loader"></div>');

    $.ajax({
      url: "https://smileschool-api.hbtn.info/popular-tutorials",
      type: "GET",
      success: function (data) {
        tutorialsCarousel.empty();
        let cardsInRow = 0;
        let currentRow;

        data.forEach((tutorial, index) => {
          if (cardsInRow === 0) {
            currentRow = $(`<div class="carousel-item ${
              index === 0 ? "active" : ""
            }">
                            <div class="row mx-auto align-items-center"></div>
                        </div>`);
            tutorialsCarousel.append(currentRow);
          }

          currentRow.find(".row").append(createCard(tutorial));
          cardsInRow++;

          if (cardsInRow === 4) {
            cardsInRow = 0;
          }
        });

        $("#carouselExampleControls2").carousel({
          interval: false,
        });
      },
    });
  }

  function loadLatestVideos() {
    const videosCarousel = $("#carouselExampleControls3 .carousel-inner");
    videosCarousel.html('<div class="loader"></div>');

    $.ajax({
      url: "https://smileschool-api.hbtn.info/latest-videos",
      type: "GET",
      success: function (data) {
        videosCarousel.empty();
        let cardsInRow = 0;
        let currentRow;

        data.forEach((video, index) => {
          if (cardsInRow === 0) {
            currentRow = $(`<div class="carousel-item ${
              index === 0 ? "active" : ""
            }">
                            <div class="row mx-auto align-items-center"></div>
                        </div>`);
            videosCarousel.append(currentRow);
          }

          currentRow.find(".row").append(createCard(video));
          cardsInRow++;

          if (cardsInRow === 4) {
            cardsInRow = 0;
          }
        });

        $("#carouselExampleControls3").carousel({
          interval: false,
        });
      },
    });
  }

  initCourses();
  loadQuotes();
  loadPopularTutorials();
  loadLatestVideos();

  $(".carousel-control-prev").click(function () {
    $($(this).data("target")).carousel("prev");
  });

  $(".carousel-control-next").click(function () {
    $($(this).data("target")).carousel("next");
  });
});
