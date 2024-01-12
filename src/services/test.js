const data = {
  status: true,
  data: [
    [
      {
        _id: "65a05f8e7de0e54857a2844b",
        subscription: "659fabdd2e38efdf007984fc",
        shares: 2,
        isPaid: true,
        proofImages: ["/uploads/2024-01-11/image_1705009069137.png"],
        createdAt: "2024-01-12T18:07:39.518Z",
        __v: 1,
        fundReceived: 25000000,
      },
    ],
    [
      {
        _id: "65a180589814a6e17910b668",
        subscription: "65a180589814a6e17910b666",
        shares: 2,
        isPaid: true,
        fundReceived: 25000000,
        proofImages: ["/uploads/2024-01-12/image_1705083005841.png"],
        createdAt: "2024-01-12T18:10:11.201Z",
        __v: 1,
      },
      {
        _id: "65a180fb9814a6e17910b6f0",
        subscription: "65a180589814a6e17910b666",
        shares: 1,
        isPaid: true,
        fundReceived: 12500000,
        proofImages: ["/uploads/2024-01-12/image_1705083150618.png"],
        createdAt: "2024-01-12T18:12:36.885Z",
        __v: 1,
      },
    ],
  ],
};

const flattenArray = (arr) => {
    console.log("Start")
  return arr.reduce((acc, curr) => {
    return acc.concat(Array.isArray(curr) ? flattenArray(curr) : curr);
  }, []);
};

const flattenedData = flattenArray(data.data);

console.log(flattenedData);
