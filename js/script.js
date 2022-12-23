'use strict';
{
  const titleClickHandler = function (event) {
    event.preventDefault();
    console.log('Link was clicked!');
    console.log(event);
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* get 'href' attribute from the clicked link */
    const linkAddress = clickedElement.getAttribute('href');
    console.log(linkAddress);

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(linkAddress);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';

  const generateTitleLinks = function (customSelector = '') {
    console.log('generating links...');

    /* remove contents of titleList */
    const linksList = document.querySelector(optTitleListSelector);
    linksList.innerHTML = '';

    /* find matching articles */
    const articles = document.querySelectorAll(
      optArticleSelector + customSelector
    );

    /* for each article */
    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element and get the title*/
      const articleTitle = article.querySelector(optTitleSelector).textContent;

      /* create HTML of the link */
      const link = `<li><a href='#${articleId}'><span>${articleTitle}</span></a></li>`;

      /* insert link into titleList */
      linksList.insertAdjacentHTML('beforeend', link);
    }
    /* add event listeners */
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const tagClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.split('-')[1];
    console.log(tag);

    /* find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let tag of activeTags) {
      /* remove class active */
      tag.classList.remove('active');
    }

    /* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */
    const matchingTags = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let tag of matchingTags) {
      /* add class active */
      tag.classList.add('active');
    }

    /* END LOOP: for each found tag link */

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const authorClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.split('-')[1];

    /* find all authors links with class active */
    const activeAuthors = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );

    /* remove class active */
    for (let author of activeAuthors) {
      author.classList.remove('active');
    }

    /* Add class active to all links with author name */
    const matchingAuthors = document.querySelectorAll('a[href="' + href + '"]');
    for (let author of matchingAuthors) {
      author.classList.add('active');
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const generateTags = function () {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagsList = article.querySelector(optArticleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        const tagHTML = `<li><a style='margin-left:10px;' href="#tag-${tag}">${tag}</a></li>`;

        /* add generated code to html variable */
        html += tagHTML;
      }

      /* END LOOP: for each tag */

      /* insert HTML of all the links into the tags wrapper */
      // console.log(html);
      tagsList.innerHTML = html;
    }

    /* END LOOP: for every article: */
  };

  generateTags();

  const generateAuthors = function () {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find element for author name */
      const postAuthor = article.querySelector(optArticleAuthorSelector);

      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');

      /* generate and insert HTML of the author link */
      postAuthor.innerHTML = `<a href="#author-${author}">${author}</a>`;
    }

    /* END LOOP: for every article: */
  };

  generateAuthors();

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tagsLinks = document.querySelectorAll(
      optArticleSelector + ' ' + optArticleTagsSelector + ' a'
    );

    /* START LOOP: for each link */
    for (let tag of tagsLinks) {
      /* add tagClickHandler as event listener for that link */
      tag.addEventListener('click', tagClickHandler);
    }

    /* END LOOP: for each link */
  };

  addClickListenersToTags();

  const addClickListenersToAuthors = function () {
    /* find all authors links */
    const authorLinks = document.querySelectorAll(
      optArticleSelector + ' ' + optArticleAuthorSelector + ' a'
    );

    /* START LOOP: for each link */
    for (let author of authorLinks) {
      /* add tagClickHandler as event listener for that link */
      author.addEventListener('click', authorClickHandler);
    }

    /* END LOOP: for each link */
  };

  addClickListenersToAuthors();
}
