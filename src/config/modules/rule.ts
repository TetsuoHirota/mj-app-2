import { Rule } from "@/models";

type RuleConfig = {
  [P in keyof Rule]: {
    label: string;
    value: Rule[P];
  }[];
};

export const ruleConfig: RuleConfig = {
  playerNumber: [
    { label: "四麻", value: 4 },
    { label: "三麻", value: 3 }
  ],
  rate: [
    { label: "レートなし", value: 0 },
    { label: "点1", value: 1 },
    { label: "点2", value: 2 },
    { label: "点3", value: 3 },
    { label: "点5", value: 5 },
    { label: "点10", value: 10 },
    { label: "点20", value: 20 },
    { label: "点50", value: 50 },
    { label: "点100", value: 100 },
    { label: "点200", value: 200 },
    { label: "点500", value: 500 }
  ],
  chip: [
    { label: "なし", value: 0 },
    { label: "50円", value: 50 },
    { label: "100円", value: 100 },
    { label: "200円", value: 200 },
    { label: "500円", value: 500 },
    { label: "1000円", value: 1000 }
  ],
  defaultScore: [
    { label: "25000点", value: 25000 },
    { label: "30000点", value: 30000 },
    { label: "35000点", value: 35000 }
  ],
  round: [
    { label: "五捨六入", value: "goshya" },
    { label: "四捨五入", value: "sisya" },
    { label: "切り捨て", value: "kirisute" },
    { label: "切り上げ", value: "kiriage" }
  ],
  tobisyou: [
    { label: "なし", value: 0 },
    { label: "5000点", value: 5000 },
    { label: "10000点", value: 10000 },
    { label: "20000点", value: 20000 }
  ],
  oka: [
    { label: "25000点", value: 25000 },
    { label: "30000点", value: 30000 },
    { label: "35000点", value: 35000 },
    { label: "40000点", value: 40000 }
  ],
  uma: [{ label: "", value: [0, 0] }],
  uma4: [
    { label: "なし", value: [0, 0] },
    { label: "5 - 10", value: [5, 10] },
    { label: "10 - 20", value: [10, 20] },
    { label: "10 - 30", value: [10, 30] },
    { label: "20 - 40", value: [20, 40] },
    { label: "30 - 60", value: [30, 60] }
  ],
  uma3: [
    { label: "なし", value: [0, 0] },
    { label: "0 - 10", value: [0, 10] },
    { label: "0 - 20", value: [0, 20] },
    { label: "0 - 30", value: [0, 30] }
  ]
};
