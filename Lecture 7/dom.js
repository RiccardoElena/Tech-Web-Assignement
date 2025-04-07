const renderDOM = (idSource, idTarget) => {
  const source = document.getElementById(idSource);
  const target = document.getElementById(idTarget);

  const classMap = new Map([
    [Node.TEXT_NODE, 'text'],
    [Node.COMMENT_NODE, 'comment'],
    [Node.ELEMENT_NODE, 'element'],
  ]);

  const isNotValid = (node) => {
    return (
      !node ||
      !classMap.has(node.nodeType) ||
      (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
    );
  };

  const createNewLi = (node) => {
    const li = document.createElement('li');
    li.textContent =
      node.nodeType === Node.ELEMENT_NODE ? node.tagName : node.textContent;
    li.classList.add(classMap.get(node.nodeType));
    return li;
  };

  const traverse = (node) => {
    if (isNotValid(node)) return;

    const li = createNewLi(node);

    if (node.nodeType === Node.ELEMENT_NODE && node.hasChildNodes) {
      const ul = document.createElement('ul');
      let childLi;
      for (const child of node.childNodes)
        if ((childLi = traverse(child))) ul.appendChild(childLi);

      li.appendChild(ul);
    }

    return li;
  };

  target.appendChild(traverse(source));
};
