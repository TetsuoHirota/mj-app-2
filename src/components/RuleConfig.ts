 export enum mjRound {
  "五捨六入",
  "四捨五入",
  "切り捨て",
  "切り上げ"
}

export enum mjPlayers {
  "三麻" = 3,
  "四麻" = 4,
}

export enum mjRate {
  "レートなし" = 0,
  "点1" = 1,
  "点2" = 2,
  "点3" = 3,
  "点5" = 5,
  "点10" = 10,
  "点20" = 20,
  "点50" = 50,
  "点100" = 100,
  "点200" = 200,
  "点500" = 500,
}

export enum mjRateKanji {
  "レートなし" = 0,
  "点一" = 1,
  "点二" = 2,
  "点三" = 3,
  "点五" = 5,
  "点十" = 10,
  "点二十" = 20,
  "点五十" = 50,
  "点百" = 100,
  "点二百" = 200,
  "点五百" = 500,
}

export const formItems = {
  players: [
    { label: "四麻", value: 4 },
    { label: "三麻", value: 3 },
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
    { label: "点500", value: 500 },
  ],
  chip: [
    { label: "チップなし", value: 0 },
    { label: "10円", value: 10 },
    { label: "20円", value: 20 },
    { label: "50円", value: 50 },
    { label: "100円", value: 100 },
    { label: "200円", value: 200 },
    { label: "300円", value: 300 },
    { label: "400円", value: 400 },
    { label: "500円", value: 500 },
    { label: "1000円", value: 1000 },
    { label: "2000円", value: 2000 },
    { label: "5000円", value: 5000 },
    { label: "10000円", value: 10000 },
  ],
  uma4: [
    { label: "なし", value: { first: 0, second: 0, third: 0, fourth: 0 } },
    { label: "5 - 10", value: { first: 10, second: 5, third: -5, fourth: -10 } },
    { label: "10 - 20", value: { first: 20, second: 10, third: -10, fourth: -20 } },
    { label: "10 - 30", value: { first: 30, second: 10, third: -10, fourth: 30 } },
    { label: "20 - 40", value: { first: 40, second: 20, third: -20, fourth: -40 } },
    { label: "30 - 60", value: { first: 60, second: 30, third: -30, fourth: -60 } },
  ],
  uma3: [
    { label: "なし", value: { first: 0, second: 0, third: 0 } },
    { label: "0 - 10", value: { first: 10, second: 0, third: -10 } },
    { label: "0 - 20", value: { first: 20, second: 0, third: -20 } },
    { label: "0 - 30", value: { first: 30, second: 0, third: -30 } },
  ],
  tobisyou: [
    0, 5, 10, 20
  ],
  round: [
    { label: "五捨六入", value: 0 },
    { label: "四捨五入", value: 1 },
    { label: "切り捨て", value: 2 },
    { label: "切り上げ", value: 3 },
  ],
  oka: [
    25000, 30000, 35000, 40000
  ],
  default: [
    25000, 30000, 35000
  ]
}