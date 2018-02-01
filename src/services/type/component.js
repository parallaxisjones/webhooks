const ONE_MINUTE = (1000 * 60);
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;
const ONE_YEAR = ONE_MONTH * 12;


export const RotorCraft = {

}

export const FixedCraft = {
  wing: {
    TIP: {
      LEFT: {
        id: '5f3d9ee4-d2e2-4bd7-b3ff-7cedc74735bb',
        name: "wing tip",
        description: "this is the mp11 payload",
        serviceInterval: ONE_MONTH * 4
      },
      RIGHT: {
        id: 'b0ab50a9-173c-4b4d-82d8-488629c7f5df',
        name: "wing tip",
        description: "this is the mp11 payload",
        serviceInterval: ONE_MONTH * 4
      }
    },
    CENTER: {
      id: '4f251fca-ab90-46db-8844-c220476d50ba',
      name: "wing tip",
      description: "this is the mp11 payload",
      serviceInterval: ONE_MONTH * 4
    },
    meta: {
      name: "wing sections",
      description: "this is the mp11 payload",
      serviceInterval: ONE_MONTH * 4
    }
  },
  tail: {
    LEFT: {
      id: '659ef021-11e3-437a-bb3f-9bf37e9092d1',
      name: "wing tip",
      description: "this is the mp11 payload",
      serviceInterval: ONE_MONTH * 4
    },
    RIGHT: {
      id: '4479966b-58a3-4c79-912c-9f5dda6b5153',
      name: "wing tip",
      description: "this is the mp11 payload",
      serviceInterval: ONE_MONTH * 4
    },
  },
  fuse: {
    id: '51e9ee1e-61b3-4904-8fc7-620f7bc91921',
    name: "wing tip",
    description: "this is the mp11 payload",
    serviceInterval: ONE_MONTH * 4
  }
};

export const Battery = {
  dronecell: {
    id: '0b4fa96f-6bc2-4f69-b7c2-c9b3047c92bb',
    name: "dronecell",
    description: "this is the mp11 payload",
    serviceInterval: ONE_MONTH * 4
  }
}

export const Payload = {
  MP11: {
    id: '153c82de-de61-4192-80e2-34a944f1b0dc',
    name: "MP11",
    serial: "MP11_PAYLOAD",
    description: "this is the mp11 payload"
  },
  MP22: {
    id: 'd8af43e4-e804-45bc-a1c7-d364ad00833a',
    name: "MP11",
    serial: "MP11_PAYLOAD",
    description: "this is the mp11 payload"
  }
};
