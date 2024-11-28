const { createRef, formatDatas } = require("../db/seed/util");

describe("createRef", () => {
  test("Returns object", () => {
    expect(typeof createRef("", "", [])).toBe("object");
  });
  test("Return object should have one key-value pair", () => {
    const refObj = createRef("host_name", "host_id", [
      { host_name: "jahanvi", host_id: 1 },
    ]);

    expect(Object.keys(refObj)).toHaveLength(1);
    expect(refObj).toHaveProperty("jahanvi");
    expect(refObj.jahanvi).toBe(1);
  });
  test("Return object should have multiple key-value pairs", () => {
    const refObj = createRef("host_name", "host_id", [
      { host_name: "jahanvi", host_id: 1 },
      { host_name: "marry", host_id: 2 },
      { host_name: "omi", host_id: 3 },
    ]);

    expect(Object.keys(refObj)).toHaveLength(3);

    expect(refObj).toHaveProperty("jahanvi");
    expect(refObj.jahanvi).toBe(1);

    expect(refObj).toHaveProperty("marry");
    expect(refObj.marry).toBe(2);

    expect(refObj).toHaveProperty("omi");
    expect(refObj.omi).toBe(3);
  });
  test("should not mutate original array", () => {
    const originalArray = [
      { host_name: "jahanvi", host_id: 1 },
      { host_name: "marry", host_id: 2 },
      { host_name: "omi", host_id: 3 },
    ];

    createRef("host_name", "host_id", originalArray);

    expect(originalArray).toEqual([
      { host_name: "jahanvi", host_id: 1 },
      { host_name: "marry", host_id: 2 },
      { host_name: "omi", host_id: 3 },
    ]);
  });
});

describe("formatDatas", () => {
  test("Return array of objects", () => {
    const refObjs = [{ jahanvi: 1 }];
    const rawData = [{ host_name: "jahanvi" }];

    const data = formatDatas(refObjs, ["host_name"], ["host_id"], rawData);

    expect(Array.isArray(data)).toBe(true);
    data.forEach((d) => {
      expect(typeof d).toBe("object");
    });
  });
  test("return array of object should not have removed key", () => {
    const refObjs = [{ jahanvi: 1 }];
    const rawData = [{ host_name: "jahanvi" }];
    const removedKeys = ["host_name"];
    const addKeys = ["host_id"];

    const data = formatDatas(refObjs, removedKeys, addKeys, rawData);

    expect(data.length).toBeGreaterThan(0);
    data.forEach((d) => {
      expect(d).not.toHaveProperty("host_name");
    });
  });
  test("return array should not have multiple removed keys", () => {
    const refObj1 = { jahanvi: 1 };
    const refObj2 = { admin: 1 };
    const rawData = [{ host_name: "jahanvi", role: "admin" }];
    const removedKeys = ["host_name", "role"];
    const addKeys = ["host_id", "role_id"];

    const data = formatDatas([refObj1, refObj2], removedKeys, addKeys, rawData);

    expect(data.length).toBeGreaterThan(0);
    data.forEach((d) => {
      expect(d).not.toHaveProperty("host_name");
      expect(d).not.toHaveProperty("role");
    });
  });
  test("return array of object should have new key", () => {
    const refObjs = [{ jahanvi: 1 }];
    const rawData = [{ host_name: "jahanvi" }];
    const removedKeys = ["host_name"];
    const addKeys = ["host_id"];

    const data = formatDatas(refObjs, removedKeys, addKeys, rawData);

    expect(data.length).toBeGreaterThan(0);
    data.forEach((d) => {
      expect(d).toHaveProperty("host_id");
    });
  });
  test("return array of objects should have multiple new key-value pairs", () => {
    const refObj1 = { jahanvi: 1 };
    const refObj2 = { admin: 1 };
    const rawData = [{ host_name: "jahanvi", role: "admin" }];
    const removedKeys = ["host_name", "role"];
    const addKeys = ["host_id", "role_id"];

    const data = formatDatas([refObj1, refObj2], removedKeys, addKeys, rawData);

    expect(data.length).toBeGreaterThan(0);
    data.forEach((d) => {
      expect(d).toHaveProperty("host_id", 1);
      expect(d).toHaveProperty("role_id", 1);
    });
  });
  test("should not mutate original array", () => {
    const refObjs = [{ jahanvi: 1 }];
    const rawData = [{ host_name: "jahanvi" }];
    const removedKeys = ["host_name"];
    const addKeys = ["host_id"];

    formatDatas(refObjs, removedKeys, addKeys, rawData);

    expect(rawData).toEqual([{ host_name: "jahanvi" }]);
  });
});
