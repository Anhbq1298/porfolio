(() => {
  const book = document.querySelector('#portfolio-book');
  const open = document.querySelector('#open-book');
  if (typeof book.showModal !== 'function') return;

  const spread = book.querySelector('.book-spread');
  const contents = book.querySelector('.book-contents');
  const contentsList = contents.querySelector('ol');
  const previous = book.querySelector('[data-turn="-1"]');
  const next = book.querySelector('[data-turn="1"]');
  const status = book.querySelector('.book-status');
  const mobile = matchMedia('(max-width: 760px)');
  let current = 0;

  const clone = (element) => {
    const copy = element.cloneNode(true);
    copy.removeAttribute('id');
    if (copy.tagName === 'IMG') copy.loading = 'eager';
    copy.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    return copy;
  };

  const section = (selector) => Array.from(document.querySelectorAll(selector), clone);
  const maybe = (element) => element ? [clone(element)] : [];

  // Lightbox buttons do not work inside the book, so open images in a new tab instead.
  const unbutton = (root) => {
    root.querySelectorAll('button[data-full]').forEach(button => {
      const link = document.createElement('a');
      link.href = button.dataset.full;
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = button.className;
      link.append(...button.childNodes);
      button.replaceWith(link);
    });
    return root;
  };

  const group = (className, children, heading) => {
    const box = document.createElement('div');
    box.className = className;
    if (heading) {
      const label = document.createElement('h4');
      label.textContent = heading;
      box.append(label);
    }
    children.forEach(child => box.append(child));
    return box;
  };

  const details = (element, heading) => {
    if (!element) return [];
    const copy = clone(element);
    copy.querySelector('summary')?.remove();
    return [group('book-details', Array.from(copy.childNodes), heading)];
  };

  const gallery = (figures) => figures.length
    ? [unbutton(group('book-gallery', figures.map(clone)))]
    : [];

  const projectPage = (project) => {
    const firm = project.closest('.firm')?.querySelector('.firm-meta h3')?.textContent;
    const role = project.closest('.firm')?.querySelector('.firm-meta .r')?.textContent;
    const standardEl = project.closest('.firm')?.querySelector('.firm-meta .mono');
    return {
      title: project.querySelector('h3').textContent,
      chapter: firm ? firm + ' · ' + (role || 'Selected projects') : 'Selected projects',
      content: () => [
        ...(standardEl ? [Object.assign(document.createElement('p'), { className: 'book-chapter', innerHTML: standardEl.innerHTML })] : []),
        ...maybe(project.querySelector('.ph .badge')),
        ...maybe(project.querySelector('.desc')),
        ...maybe(project.querySelector('.proj-points')),
        ...details(project.querySelector('details.more'), 'Scope and technical details'),
        ...maybe(project.querySelector('.codes')),
        ...gallery(Array.from(project.querySelectorAll('.gallery figure'))),
        ...maybe(project.querySelector('.more-link')),
      ],
    };
  };

  const toolPage = (tool) => ({
    title: tool.querySelector('h3').textContent,
    key: tool.id,
    chapter: 'Engineering tools',
    content: () => {
      const diagram = tool.querySelector('.home-flow');
      const media = Array.from(tool.querySelectorAll('.tool-media button[data-full]'));
      return [
        ...maybe(tool.querySelector('.badge')),
        ...Array.from(tool.querySelectorAll('.tool-statement'), clone),
        ...(diagram ? [unbutton(clone(diagram))] : []),
        ...details(tool.querySelector('details.more'), 'Technical scope'),
        ...(media.length ? [unbutton(group('book-gallery', media.map(clone)))] : []),
        ...maybe(tool.querySelector('.tool-links')),
      ];
    },
  });

  const pages = [
    { title: document.querySelector('.hero h1').textContent, key: 'top',
      content: () => [
        ...section('.hero .role, .hero .lead, .hero .portrait, .hero .focus, .hero .stats'),
        group('book-downloads', Array.from(document.querySelectorAll('.hero .cv-download'), clone)),
      ] },
    { title: 'About & Education', key: 'about', content: () => section('#about .about') },
    { title: 'Core Skills', key: 'skills', content: () => section('#skills .skills') },
    ...Array.from(document.querySelectorAll('#experience .proj'), projectPage),
    ...Array.from(document.querySelectorAll('#tools .flagship-tool'), toolPage),
    ...(document.querySelector('#tools .others') ? [{
      title: 'Other automation tools',
      key: 'other-automation',
      chapter: 'Engineering tools',
      content: () => [unbutton(clone(document.querySelector('#tools .others')))],
    }] : []),
    { title: 'Contact', key: 'contact', content: () => section('#contact .contact p, #contact .contact-list') },
  ];

  const pageCount = () => mobile.matches ? 1 : 2;

  function render(index, direction = 0) {
    current = index;
    spread.replaceChildren();
    spread.dataset.turn = direction < 0 ? 'back' : direction > 0 ? 'forward' : '';
    const visible = pages.slice(current, current + pageCount());

    visible.forEach(({ title, chapter, content }, offset) => {
      const page = document.createElement('article');
      page.className = 'book-page';
      page.tabIndex = 0;
      const heading = document.createElement('h3');
      heading.id = 'book-page-' + (current + offset + 1);
      heading.textContent = title;
      page.setAttribute('aria-labelledby', heading.id);
      if (chapter) {
        const label = document.createElement('p');
        label.className = 'book-chapter';
        label.textContent = chapter;
        page.append(label);
      }
      page.append(heading, ...content());
      spread.append(page);
    });

    const end = current + visible.length;
    status.textContent = (visible.length > 1 ? (current + 1) + '–' + end : end) + ' / ' + pages.length;
    previous.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(end === pages.length));
    Array.from(contentsList.querySelectorAll('button')).forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function turn(direction) {
    const control = direction < 0 ? previous : next;
    if (control.getAttribute('aria-disabled') === 'true') return;
    const focusedPage = spread.contains(document.activeElement);
    render(Math.max(0, current + direction * pageCount()), direction);
    if (focusedPage) spread.firstElementChild.focus();
  }

  pages.forEach(({ title, chapter }, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = chapter ? chapter + ' · ' + title : title;
    button.addEventListener('click', () => {
      render(index, index - current);
      contents.open = false;
      spread.firstElementChild.focus();
    });
    item.append(button);
    contentsList.append(item);
  });

  open.addEventListener('click', () => {
    render(current);
    book.showModal();
    book.querySelector('summary').focus();
  });
  book.addEventListener('close', () => {
    contents.open = false;
    spread.replaceChildren();
    open.focus();
  });
  book.querySelector('.book-close').addEventListener('click', () => book.close());
  previous.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  book.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || contents.open) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    turn(event.key === 'ArrowLeft' ? -1 : 1);
  });
  spread.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const index = pages.findIndex(page => page.key === link.hash.slice(1));
    if (index < 0) {
      book.close();
      return;
    }
    event.preventDefault();
    render(index, index - current);
    spread.firstElementChild.focus();
  });
  mobile.addEventListener('change', () => {
    if (!book.open) return;
    const focusedPage = spread.contains(document.activeElement);
    render(current);
    if (focusedPage) spread.firstElementChild.focus();
  });

  open.hidden = false;
})();
