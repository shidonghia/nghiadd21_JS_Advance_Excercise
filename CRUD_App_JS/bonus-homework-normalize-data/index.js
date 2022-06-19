const data = [
  { id: 999999, name: "Phòng to nhất", parentId: null },
  { id: 1, name: "GHTK", parentId: 999999 },
  { id: 11, name: "Phòng CNTT", parentId: 1 },
  { id: 111, name: "Nhóm 1", parentId: 11 },
  { id: 112, name: "Nhóm 2", parentId: 11 },
  { id: 12, name: "Phòng KT", parentId: 1 },
  { id: 121, name: "Nhóm 1", parentId: 12 },
  { id: 122, name: "Nhóm 2", parentId: 12 },
  { id: 2, name: "FPT", parentId: 999999 },
  { id: 21, name: "Phòng Giám sát FPT", parentId: 2 },
  { id: 211, name: "Nhóm 1", parentId: 21 },
  { id: 212, name: "Nhóm 2", parentId: 21 },
  { id: 22, name: "Phòng Pháp chế", parentId: 2 },
  { id: 221, name: "Nhóm 1", parentId: 22 },
  { id: 222, name: "Nhóm 2", parentId: 22 },
  { id: 3, name: "VNPAY", parentId: 999999 },
  { id: 31, name: "Phòng GTGT", parentId: 3 },
  { id: 311, name: "Nhóm 1", parentId: 31 },
  { id: 312, name: "Nhóm 2", parentId: 31 },
  { id: 32, name: "Phòng Vận hành", parentId: 3 },
  { id: 321, name: "Nhóm 1", parentId: 32 },
  { id: 322, name: "Nhóm 2", parentId: 32 },
];

const updateDepthObj = (obj, data, arrNumber) => {
  const [first, ...rest] = arrNumber;
  // console.log("Hello: ", obj, arrNumber);
  if (rest.length === 0) {
    // console.log("hi:", obj);
    obj[first - 1].children.push({ ...data, children: [] });
    // console.log(obj);
  } else {
    // console.log("recur", obj[first - 1]);
    updateDepthObj(obj[first - 1].children, data, rest);
  }
};

const sortByIdString = (a, b) => {
  if (a.id.toString() < b.id.toString()) {
    return -1;
  }
  if (a.id.toString() > b.id.toString()) {
    return 1;
  }
  return 0;
};

const normalizeData = (dataArr) => {
  let lastElementTemp = dataArr.splice(-1);
  dataArr = [...lastElementTemp, ...dataArr];
  let resultData = {};
  dataArr.map((data) => {
    if (!data.parentId) {
      resultData = { ...data, children: [] };
    } else if (data.id.toString().length === 1) {
      resultData.children.push({ ...data, children: [] });
    } else {
      const arrayOfNumber = data.id.toString().split("");
      arrayOfNumber.pop();
      updateDepthObj(resultData.children, data, arrayOfNumber);
    }
  });
  return resultData;
};

data.push({ id: 1121, name: "Nhóm 3", parentId: 112 });
data.push({ id: 5, name: "Nhóm 1", parentId: 999999 });
data.push({ id: 4, name: "Nhóm 1", parentId: 999999 });
data.push({ id: 41, name: "Nhóm 2", parentId: 4 });
data.push({ id: 9, name: "Nhóm 1", parentId: 999999 });
data.push({ id: 411, name: "Nhóm 3", parentId: 41 });
data.push({ id: 7, name: "Nhóm 1", parentId: 999999 });
data.push({ id: 11211, name: "Nhóm 4", parentId: 1121 });

const normalizedData = normalizeData(data.sort(sortByIdString));

console.log(normalizedData);
