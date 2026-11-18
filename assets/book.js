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
    copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    return copy;
  };

  const section = (selector) => Array.from(document.querySelectorAll(selector), clone);
  const pages = [
    { title: document.querySelector('.hero h1').textContent, key: 'top',
      content: () => section('.hero .role, .hero .lead, .hero .portrait') },
    { title: 'About & Education', key: 'about', content: () => section('#about .about') },
    { title: 'Core Skills', key: 'skills', content: () => section('#skills .skills') },
    ...Array.from(document.querySelectorAll('#experience .proj'), project => ({
      title: project.querySelector('h3').textContent,
      chapter: 'Selected Projects',
      content: () => {
        const image = project.querySelector('.gallery img');
        return [
          clone(project.querySelector('.desc')),
          ...(image ? [clone(image)] : []),
          clone(project.querySelector('.more-link')),
        ];
      },
    })),
    ...Array.from(document.querySelectorAll('#tools .flagship-tool'), tool => ({
      title: tool.querySelector('h3').textContent,
      key: tool.id,
      chapter: 'Engineering Tools',
      content: () => {
        const diagram = clone(tool.querySelector('.home-flow'));
        const button = diagram.querySelector('[data-full]');
        const link = document.createElement('a');
        link.href = button.dataset.full;
        link.target = '_blank';
        link.rel = 'noopener';
        link.append(button.querySelector('img'));
        button.replaceWith(link);
        return [
          ...Array.from(tool.querySelectorAll('.tool-statement'), clone),
          diagram,
          clone(tool.querySelector('.tool-links')),
        ];
      },
    })),
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
