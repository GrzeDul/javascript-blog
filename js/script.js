'use strict';
{
  const templates = {
    articleAuthor: Handlebars.compile(
      document.querySelector('#template-article-author').innerHTML
    ),
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    articleTags: Handlebars.compile(
      document.querySelector('#template-article-tags').innerHTML
    ),
    tagCloudLink: Handlebars.compile(
      document.querySelector('#template-tag-cloud-link').innerHTML
    ),
    authorRightList: Handlebars.compile(
      document.querySelector('#template-author-right-list').innerHTML
    ),
  };
  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };

  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
      title: '.post-title',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.list.authors',
    },
  };

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

  const generateTitleLinks = function (customSelector = '') {
    console.log('generating links...');

    /* remove contents of titleList */
    const linksList = document.querySelector(select.listOf.titles);
    linksList.innerHTML = '';

    /* find matching articles */
    const articles = document.querySelectorAll(
      select.all.articles + customSelector
    );

    /* for each article */
    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element and get the title*/
      const articleTitle = article.querySelector(
        select.article.title
      ).textContent;

      /* create HTML of the link */
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      /* insert link into titleList */
      linksList.insertAdjacentHTML('beforeend', linkHTML);
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

  const calculateTagsParams = function (tags) {
    const params = { min: 999999, max: 0 };
    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function (count, params) {
    /* difference from min value*/
    const normalizedCount = count - params.min;

    /* difference from max to min value*/
    const normalizedMax = params.max - params.min;

    /* getting count percentage in values range*/
    const percentage = normalizedCount / normalizedMax;

    /* converting float number to integer and to correct class value*/
    const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);

    return opts.tagSizes.classPrefix + classNumber;
  };

  const generateTags = function () {
    /* create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagList = article.querySelector(select.article.tags);

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
        const tagId = tag;
        const tagsHTMLData = { id: tagId, title: tag };
        const tagsHTML = templates.articleTags(tagsHTMLData);

        /* add generated code to html variable */
        html += tagsHTML;

        /* check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      /* END LOOP: for each tag */

      /* insert HTML of all the links into the tags wrapper */
      // console.log(html);
      tagList.innerHTML = html;
    }
    /* END LOOP: for every article: */

    /* find list of tags in right column */
    const tagList = document.querySelector(select.listOf.tags);

    /* calculate tagsParams */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* create variable for template data */
    const allTagsData = { tags: [] };

    /* START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* put data for allTags template */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }
    /* END LOOP: for each tag in allTags: */

    /* add template to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  };

  generateTags();

  const generateAuthors = function () {
    /* create a new variable allAuthors with an empty array and one for data*/
    const allAuthors = [];
    const allAuthorsData = { authors: [] };

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find element for author name */
      const postAuthor = article.querySelector(select.article.author);

      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');

      /* generate and insert HTML templateof the author link */
      /* create HTML template of the link */
      const linkHTMLData = { id: author, title: author };
      const linkHTML = templates.articleAuthor(linkHTMLData);
      postAuthor.innerHTML = linkHTML;

      /* check if this link is NOT already in allAuthors */
      if (allAuthors.indexOf(author) == -1) {
        /* add generated code to allAuthors array */
        allAuthors.push(author);
      }
    }
    /* END LOOP: for every article: */

    /* Put every author to template data */
    for (let author of allAuthors) {
      allAuthorsData.authors.push({ id: author, title: author });
    }
    /* find list of authors in right column */
    const authorList = document.querySelector(select.listOf.authors);

    /* add HTML template with allAuthorsData to authorList */
    authorList.innerHTML = templates.authorRightList(allAuthorsData);
  };

  generateAuthors();

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tagsLinks = document.querySelectorAll(select.all.linksTo.tags);

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
    const authorLinks = document.querySelectorAll(select.all.linksTo.authors);

    /* START LOOP: for each link */
    for (let author of authorLinks) {
      /* add tagClickHandler as event listener for that link */
      author.addEventListener('click', authorClickHandler);
    }
    /* END LOOP: for each link */
  };

  addClickListenersToAuthors();
}
