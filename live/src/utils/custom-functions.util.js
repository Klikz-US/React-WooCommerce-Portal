export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const convertStringToHTML = (string) => {
  let html = document.createElement("div");
  html.innerHTML = string;
  return html.firstChild;
};
