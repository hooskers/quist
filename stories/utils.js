const generateItems = count => {
  let items = {};

  for (let i = 0; i < count; i++) {
    items[`test${i}`] = {
      title: `Test Item ${i}`,
      checked: Math.round(Math.random()),
    };
  }

  return items;
};

const generateLists = (listCount = 5, itemCount = 5) => {
  let lists = [];

  for (let i = 0; i < listCount; i++) {
    lists.push({
      title: `Test List ${i}`,
      items: generateItems(itemCount),
    });
  }

  return lists;
};

export { generateItems, generateLists };
