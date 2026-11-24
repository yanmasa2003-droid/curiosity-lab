'use strict';
const LAB_GROUPS=[{"name":"社会と制度","en":"SOCIETY","ink":"#174f58","bg":"#d5ece8","image":"city"},{"name":"言葉と対話","en":"WORDS","ink":"#714c68","bg":"#f1e0eb","image":"writing"},{"name":"歴史と文化","en":"HISTORY","ink":"#805337","bg":"#f1e2cf","image":"history"},{"name":"芸術とデザイン","en":"ART","ink":"#4b4e8c","bg":"#e5e4f7","image":"tools"},{"name":"暮らしと料理","en":"EVERYDAY","ink":"#946039","bg":"#f7ead7","image":"kitchen"},{"name":"心理とデータ","en":"MIND","ink":"#805260","bg":"#f2e1dc","image":"forest"},{"name":"自然と生きもの","en":"NATURE","ink":"#416b44","bg":"#e2edda","image":"forest"},{"name":"科学と偶然","en":"SCIENCE","ink":"#386c88","bg":"#e1eef5","image":"ocean"}];
const LAB_EXPERIMENTS=[
 {
  "id": "seats",
  "group": "社会と制度",
  "title": "その票は、何議席になる？",
  "short": "票を動かして、小さな議会をつくる。",
  "article": "money",
  "controls": [
   {
    "key": "a",
    "label": "Aの票",
    "min": 1,
    "max": 100,
    "value": 45,
    "unit": "票",
    "step": 1,
    "type": "range"
   },
   {
    "key": "b",
    "label": "Bの票",
    "min": 1,
    "max": 100,
    "value": 35,
    "unit": "票",
    "step": 1,
    "type": "range"
   },
   {
    "key": "c",
    "label": "Cの票",
    "min": 1,
    "max": 100,
    "value": 20,
    "unit": "票",
    "step": 1,
    "type": "range"
   },
   {
    "key": "n",
    "label": "議席の数",
    "min": 3,
    "max": 20,
    "value": 10,
    "unit": "席",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "議席を3席まで減らし、得票の比率と議席の比率を見比べてみましょう。",
  "explain": "ドント式では各得票を1、2、3…で割り、商の大きい順に席を配ります。票数を少しずつ変えても、議席は整数。その丸め方が結果に表れます。下の配分順も見てみてください。",
  "limit": "架空の3グループの教材。商が同点ならA→B→Cを優先する独自ルールです。現実の選挙の同点処理やすべての法的条件は再現しません。",
  "preset": {
   "n": 3
  },
  "references": [
   {
    "name": "国分寺市：ドント式の計算例",
    "url": "https://www.city.kokubunji.tokyo.jp/faq/kurashi/1005242/1005321/1006573.html",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "budget",
  "group": "社会と制度",
  "title": "100枚の予算を、どう配る？",
  "short": "増やすと、どこが減るだろう。",
  "article": "money",
  "controls": [
   {
    "key": "a",
    "label": "学びへの希望",
    "min": 0,
    "max": 100,
    "value": 50,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "b",
    "label": "公園への希望",
    "min": 0,
    "max": 100,
    "value": 30,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "c",
    "label": "交通への希望",
    "min": 0,
    "max": 100,
    "value": 20,
    "unit": "",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "学びだけを増やしたとき、ほかの配分も眺めてください。",
  "explain": "希望の重みを合計100枚に比例配分しています。合計は増えないので、一つの比率を上げると別の比率が下がります。どれがよいかではなく、同じ資源を分けるときの関係を見る模型です。",
  "limit": "希望値は金額ではありません。すべて0なら均等に配分します。行政の費用・政策効果・幸福度は計算していません。",
  "preset": {
   "a": 90,
   "b": 5,
   "c": 5
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "majority",
  "group": "社会と制度",
  "title": "多数決が、ぐるぐる回る。",
  "short": "Aに勝つB、そのBに勝つのは？",
  "article": "choice",
  "controls": [
   {
    "key": "a",
    "label": "A→B→Cが好きな人",
    "min": 1,
    "max": 15,
    "value": 5,
    "unit": "人",
    "step": 1,
    "type": "range"
   },
   {
    "key": "b",
    "label": "B→C→Aが好きな人",
    "min": 1,
    "max": 15,
    "value": 5,
    "unit": "人",
    "step": 1,
    "type": "range"
   },
   {
    "key": "c",
    "label": "C→A→Bが好きな人",
    "min": 1,
    "max": 15,
    "value": 5,
    "unit": "人",
    "step": 1,
    "type": "range"
   },
   {
    "key": "order",
    "label": "最初の対決",
    "options": [
     "A 対 B",
     "B 対 C",
     "C 対 A"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "人数は同じまま、最初の対決だけを変えてみましょう。",
  "explain": "一人ずつの好みが一貫していても、集計した一対一の多数決は循環することがあります。勝った案と残りの案を対決させると、順番によって最後の勝者が変わる例を計算しています。",
  "limit": "架空の好みの算術モデル。同票の対決は引き分けで止めます。人数を変えると循環しない場合もあります。実際の集団の価値判断を採点するものではありません。",
  "preset": {
   "order": 1
  },
  "references": [
   {
    "name": "福島県教育委員会：多数決における一つの矛盾（PDF）",
    "url": "https://www.pref.fukushima.lg.jp/img/kyouiku/attachment/905140.pdf",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "wordorder",
  "group": "言葉と対話",
  "title": "同じ情報、順番だけ変える。",
  "short": "説明を「相手が使う順」に組み替える。",
  "article": "plain",
  "controls": [
   {
    "key": "order",
    "label": "先に伝えるもの",
    "options": [
     "すること → 期限 → 理由",
     "理由 → 期限 → すること",
     "期限 → すること → 理由"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "最初の一文だけを読み、何をすればいいか分かるか比べてみてください。",
  "explain": "情報の内容を変えず、並ぶ順だけを動かします。結論が先だと行動を探しやすい場面があり、理由が先だと背景を考えやすい場面もあります。相手の目的と、いま必要な情報の組合せを考えるための作例です。",
  "limit": "架空の案内文です。万人に最も伝わる順序を測定・判定しているわけではありません。",
  "preset": {
   "order": 1
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "ambiguity",
  "group": "言葉と対話",
  "title": "その「白い」、どこまでかかる？",
  "short": "文の中の、二つの景色を見比べる。",
  "article": "plain",
  "controls": [
   {
    "key": "scope",
    "label": "どんな場面を伝えたい？",
    "options": [
     "女の子の帽子だけ白い",
     "二人とも白い帽子"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "場面を切り替えたら、下に出る言い換えも読んでみましょう。",
  "explain": "「白い帽子の女の子と男の子」という文だけでは、男の子の帽子について何を伝えたいかが曖昧です。図の二つの場面は、言葉を具体的に足して区別できます。分かりやすさは、短さだけでは決まりません。",
  "limit": "意味の範囲を比べる編集部の作例です。文脈や話し方によって解釈が絞られる場合もあります。",
  "preset": {
   "scope": 1
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "framing",
  "group": "言葉と対話",
  "title": "80%成功と、20%失敗。",
  "short": "同じ内訳を、二つの言い方で眺める。",
  "article": "choice",
  "controls": [
   {
    "key": "p",
    "label": "成功した人数",
    "min": 0,
    "max": 100,
    "value": 80,
    "unit": "人",
    "step": 1,
    "type": "range"
   },
   {
    "key": "view",
    "label": "強調する見出し",
    "options": [
     "成功から伝える",
     "失敗から伝える"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "見出しを切り替えても、下の100人は変わらないことを確かめてください。",
  "explain": "同じ結果でも、どちら側を見出しにするかで目に入りやすい情報は変わります。内訳を両方表示すると、見出しから抜け落ちた側も見えます。自分がどんな印象を受けるか、立ち止まって比べてみましょう。",
  "limit": "架空の100人。実際の行動変化や心理効果の大きさは予測しません。個人の性格・偏りの診断にも使いません。",
  "preset": {
   "view": 1
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "localtime",
  "group": "歴史と文化",
  "title": "町ごとに、時計が違ったら。",
  "short": "鉄道の前と後を、時計の模型で比べる。",
  "article": "railtime",
  "controls": [
   {
    "key": "hour",
    "label": "共通の基準時刻",
    "min": 8,
    "max": 18,
    "value": 12,
    "unit": "時",
    "step": 1,
    "type": "range"
   },
   {
    "key": "mode",
    "label": "使う時計",
    "options": [
     "町の太陽を基準にする",
     "共通の時刻にそろえる"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "共通時刻へ切り替え、町ごとの数字がどうなるか比べてください。",
  "explain": "平均太陽時の考え方では、経度15度の差が1時間に相当します。この模型では経度135度を基準に、西の町125度、東の町145度を置きました。共通時刻の採用は、離れた町の予定を合わせるための制度としても見られます。",
  "limit": "架空の町と平均太陽時の模型。季節による均時差や夏時間、歴史上の全地域の制度は再現しません。",
  "preset": {
   "mode": 1
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "barter",
  "group": "歴史と文化",
  "title": "欲しいものが、すれ違う町。",
  "short": "交換をつなぐ「共通の券」を入れてみる。",
  "article": "money",
  "controls": [
   {
    "key": "token",
    "label": "交換の条件",
    "options": [
     "物と物だけで交換",
     "共通の券も受け取る"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "直接交換できる相手と、券を使った受け渡しの違いを見てください。",
  "explain": "パン屋は布、仕立屋は魚、魚屋はパンが欲しいとします。一対一の物々交換では欲しいものが一致しませんが、三人で同時に交換する道はあります。共通の券なら売る時と買う時を分けられる、という条件の違いを比べます。",
  "limit": "架空の交換例です。貨幣の起源が物々交換だけだったと主張するものではありません。券が使えるには受け手の同意などの条件が必要です。",
  "preset": {
   "token": 1
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "evidence",
  "group": "歴史と文化",
  "title": "一枚の記録で、歴史は決まる？",
  "short": "違う時代の資料を、机に並べる。",
  "article": "railtime",
  "controls": [
   {
    "key": "set",
    "label": "机に出す資料",
    "options": [
     "後年の回想だけ",
     "回想と当日の記録",
     "さらに工事記録を重ねる"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "資料を増やすたびに、「開いた」の意味がどう分かれるか眺めてください。",
  "explain": "後年の回想は5月、当日の記録は6月、工事記録は4月を示します。仮設の通行、工事の完成、正式な開通式は同じ日とは限りません。数が多い方を正解とするのではなく、何を記録した資料なのかを読み分ける体験です。",
  "limit": "すべて架空の町と資料。信頼度を点数化せず、資料が食い違う理由の候補を示します。実在の歴史的事件の再現ではありません。",
  "preset": {
   "set": 2
  },
  "references": [
   {
    "name": "国立公文書館：資料の探し方",
    "url": "https://www.archives.go.jp/guide/howtosearch.html",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "rgb",
  "group": "芸術とデザイン",
  "title": "光で、色を調合する。",
  "short": "赤・緑・青を動かして、画面の色をつくる。",
  "article": "color",
  "controls": [
   {
    "key": "r",
    "label": "赤",
    "min": 0,
    "max": 255,
    "value": 80,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "g",
    "label": "緑",
    "min": 0,
    "max": 255,
    "value": 170,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "b",
    "label": "青",
    "min": 0,
    "max": 255,
    "value": 200,
    "unit": "",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "三つを最大にしてから、一色だけ減らしてみましょう。",
  "explain": "ディスプレイの色は赤・緑・青の成分の組合せとして指定できます。全部0なら黒、全部255なら白です。絵の具を混ぜるときとは違い、光の三成分で色を作る考え方を試せます。",
  "limit": "RGBコード値の模型で、数値は光のエネルギーそのものではありません。見え方は画面設定や周囲の照明でも変わります。",
  "preset": {
   "r": 255,
   "g": 255,
   "b": 255
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "perspective",
  "group": "芸術とデザイン",
  "title": "一本の道を、絵の中に。",
  "short": "消失点を動かして、空間を描いてみる。",
  "article": "color",
  "controls": [
   {
    "key": "x",
    "label": "消失点の横位置",
    "min": 80,
    "max": 520,
    "value": 300,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "y",
    "label": "地平線の高さ",
    "min": 60,
    "max": 200,
    "value": 120,
    "unit": "",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "消失点を端へ寄せ、道の向きが変わる様子を見てください。",
  "explain": "平行な道の縁を、画面上では一つの点へ向かう線として描いています。これは一点透視の作図模型です。地平線と消失点を動かすだけで、同じ平面に奥行きの手がかりが生まれます。",
  "limit": "作図の教材。レンズの歪み、実測寸法、あらゆる視点の投影は計算していません。色の参考映像は視覚を考える補足です。",
  "preset": {
   "x": 130,
   "y": 90
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "composition",
  "group": "芸術とデザイン",
  "title": "主役を、どこへ置こう。",
  "short": "余白と配置で、同じ景色を変える。",
  "article": "lapis",
  "controls": [
   {
    "key": "x",
    "label": "主役の横位置",
    "min": 60,
    "max": 540,
    "value": 300,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "y",
    "label": "主役の縦位置",
    "min": 80,
    "max": 260,
    "value": 180,
    "unit": "",
    "step": 1,
    "type": "range"
   },
   {
    "key": "grid",
    "label": "三分割の補助線",
    "options": [
     "表示する",
     "外す"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "中央と三分割の交点に主役を置いて、印象を比べてください。",
  "explain": "同じ画面でも、主役の位置によって余白や視線の行き先が変わります。三分割の線は配置を考える一つの手がかりです。中央に置くことにも、対称性や強さを感じる場合があります。気に入る配置を、自分の目で探してみましょう。",
  "limit": "美しさの採点はしません。主役と背景は編集部の図形です。三分割がすべての作品の正解という意味ではありません。",
  "preset": {
   "x": 400,
   "y": 210
  },
  "references": [
   {
    "name": "キヤノン：黄金分割・三分割法",
    "url": "https://personal.canon.jp/articles/beginner/glossary/ogombunkatsu",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "packing",
  "group": "暮らしと料理",
  "title": "折り方で、棚は広くなる？",
  "short": "同じ布を、違う長方形にして並べる。",
  "article": "fold",
  "controls": [
   {
    "key": "w",
    "label": "布の横幅",
    "min": 8,
    "max": 25,
    "value": 12,
    "unit": "cm",
    "step": 1,
    "type": "range"
   },
   {
    "key": "h",
    "label": "布の縦幅",
    "min": 8,
    "max": 25,
    "value": 18,
    "unit": "cm",
    "step": 1,
    "type": "range"
   },
   {
    "key": "rotate",
    "label": "置く向き",
    "options": [
     "そのまま",
     "90度回す"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "向きだけを変え、入る枚数と空く場所を比べましょう。",
  "explain": "40×30cmの棚に、同じ長方形を格子状に置きます。横に入る個数と縦に入る個数の積が枚数になります。面積が同じでも、辺の長さと棚の寸法の組合せによって、すき間の残り方が変わります。",
  "limit": "厚みや布の伸びは無視し、全枚同じ向きで並べる模型です。自由な混在配置での最大収納数を求めるものではありません。",
  "preset": {
   "rotate": 1
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "recipe",
  "group": "暮らしと料理",
  "title": "2人分を、5人分にする。",
  "short": "材料の比率を、台所の図でつかむ。",
  "article": "salad",
  "controls": [
   {
    "key": "people",
    "label": "作る人数",
    "min": 1,
    "max": 6,
    "value": 2,
    "unit": "人",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "人数を変えても、材料同士の比率は同じことを確かめてください。",
  "explain": "基準は2人分、きゅうり1本・ツナ70g・しょうゆ小さじ1/2です。人数÷2を各材料に掛けています。分量の計算と、味見して調整する作業は別です。缶や野菜の大きさで、実際の味も変わります。",
  "limit": "既存記事の練習用レシピを比例計算した例です。加熱時間や保存期間を人数倍にする方法ではありません。端数は表示上丸めています。",
  "preset": {
   "people": 5
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "parallel",
  "group": "暮らしと料理",
  "title": "家事は、順番だけで短くなる？",
  "short": "待ち時間に、別の用事を重ねる。",
  "article": "drying",
  "controls": [
   {
    "key": "start",
    "label": "洗濯機を動かし始める時刻",
    "min": 0,
    "max": 30,
    "value": 25,
    "unit": "分後",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "洗濯機を先に動かすと、終わる時刻がどう変わるでしょう。",
  "explain": "衣類整理10分、荷物の準備15分、その二つと洗濯30分が終わったら仕上げ5分、という架空の工程です。洗濯機が動く間に手作業を進めると、待ち時間を重ねられます。計算はmax（洗濯終了、手作業終了）＋5分です。",
  "limit": "所要時間は固定した教材用の値です。実際の洗濯コース・準備時間は異なります。家事の上手さや効率を採点しません。",
  "preset": {
   "start": 0
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "average",
  "group": "心理とデータ",
  "title": "平均は、誰の顔をしている？",
  "short": "一つの大きな数で、代表値を揺らす。",
  "article": "chance",
  "controls": [
   {
    "key": "last",
    "label": "5人目の待ち時間",
    "min": 5,
    "max": 50,
    "value": 6,
    "unit": "分",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "5人目だけを50分へ。平均と中央値の線を見てください。",
  "explain": "五つの待ち時間は2、3、4、5、操作した値です。平均は合計を5で割り、中央値は順に並べた真ん中。極端な一つの値があるとき、どちらがどんな特徴を伝えるかが変わります。指標の名前だけでなく、元の並びも見ることが大切です。",
  "limit": "5件の架空の待ち時間です。外れ値を無条件に削除すべきだという意味ではありません。",
  "preset": {
   "last": 50
  },
  "references": [
   {
    "name": "総務省統計局：中心的な傾向を捉える",
    "url": "https://www.stat.go.jp/naruhodo/5_tokucho/chushin.html",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "baserate",
  "group": "心理とデータ",
  "title": "「見つけた」は、どれくらい本当？",
  "short": "珍しさを変えて、判定の内訳を見る。",
  "article": "chance",
  "controls": [
   {
    "key": "p",
    "label": "1000個のうち赤い玉の割合",
    "min": 1,
    "max": 50,
    "value": 5,
    "unit": "%",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "赤い玉を1%まで減らし、誤って反応する白い玉の数と比べましょう。",
  "explain": "赤い玉には90%、白い玉には10%反応する仮想センサーです。反応した玉だけを集めると、赤い玉が何割かは元の赤の割合にも左右されます。赤をよく拾うことと、拾った玉の多くが赤であることは別の割合です。",
  "limit": "医学的検査や実在の装置ではない算術模型。個数は確率から求めた期待値なので、小数になる場合があります。",
  "preset": {
   "p": 1
  },
  "references": [
   {
    "name": "総務省統計局：条件付き確率とベイズ理論",
    "url": "https://www.stat.go.jp/naruhodo/15_episode/toukeigaku/meiwaku.html",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "mix",
  "group": "心理とデータ",
  "title": "全体で見ると、結果が逆転？",
  "short": "難易度の混ざり方で、数字を読み直す。",
  "article": "chance",
  "controls": [
   {
    "key": "a",
    "label": "Aのうち易しい課題の割合",
    "min": 0,
    "max": 100,
    "value": 10,
    "unit": "%",
    "step": 1,
    "type": "range"
   },
   {
    "key": "b",
    "label": "Bのうち易しい課題の割合",
    "min": 0,
    "max": 100,
    "value": 90,
    "unit": "%",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "AもBも易しい課題を50%にしてから、最初の条件と比べましょう。",
  "explain": "易しい課題ではAが90%、Bが80%。難しい課題ではAが30%、Bが20%成功します。それぞれAが高くても、難易度の混ざり方次第で全体の成功率はBが高くなります。集計値を比べる前に、内訳の条件を確認するための例です。",
  "limit": "各組100件とした架空の期待値の計算。実際の人やサービスの能力比較ではありません。参考資料は代表値とデータの読み方の背景です。",
  "preset": {
   "a": 50,
   "b": 50
  },
  "references": [
   {
    "name": "総務省統計局：中心的な傾向を捉える",
    "url": "https://www.stat.go.jp/naruhodo/5_tokucho/chushin.html",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "camouflage",
  "group": "自然と生きもの",
  "title": "見えているのに、見つからない。",
  "short": "背景を変えて、葉の姿を探す。",
  "article": "camouflage",
  "controls": [
   {
    "key": "background",
    "label": "周囲の景色",
    "options": [
     "葉が茂る場所",
     "乾いた地面",
     "明るい無地"
    ],
    "value": 0,
    "type": "select"
   }
  ],
  "prompt": "葉そのものは変えず、背景だけを切り替えてください。",
  "explain": "形と色が背景に似ることで、目に入り方は変わります。同じ図形でも、どこに置くかで目立ち方を比べられます。実物の擬態を考えるときは、観察する動物の視覚や、輪郭、光の条件なども関わります。",
  "limit": "人が画面を見るための図形教材です。特定の生物や捕食者の視覚、発見される確率は再現・測定しません。",
  "preset": {
   "background": 2
  },
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "selection",
  "group": "自然と生きもの",
  "title": "世代が変わると、色の比率は？",
  "short": "遺伝する二つの型を、単純な模型で追う。",
  "article": "camouflage",
  "controls": [
   {
    "key": "p",
    "label": "最初の緑の割合",
    "min": 5,
    "max": 95,
    "value": 50,
    "unit": "%",
    "step": 1,
    "type": "range"
   },
   {
    "key": "w",
    "label": "緑が次世代へ残す数の相対値",
    "min": 0.5,
    "max": 1.5,
    "value": 1.15,
    "unit": "倍",
    "step": 0.05,
    "type": "range"
   },
   {
    "key": "t",
    "label": "進める世代",
    "min": 0,
    "max": 20,
    "value": 8,
    "unit": "世代",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "相対値を1より下にして、緑の割合の変化を比べましょう。",
  "explain": "緑と茶の型は親からそのまま受け継がれ、茶が1に対して緑が指定の比率だけ次世代を残すと仮定しています。毎世代、割合を更新すると、小さな違いが積み重なります。個体が意思で色を変えるのではなく、集団内の型の比率が変わる模型です。",
  "limit": "無限に大きい集団を想定し、交配・突然変異・移動・遺伝的浮動は省略しています。自然界の予測や、能力の優劣を表す模型ではありません。",
  "preset": {
   "w": 0.85
  },
  "references": [
   {
    "name": "動物生態学：自然選択と適応度の学習内容",
    "url": "https://irweb.kawahara.ac.jp/uhe_syllabus/SyllabusDetail.aspx?jc=ENS20901&jn=2026",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "limiting",
  "group": "自然と生きもの",
  "title": "たくさん足せば、育つだろうか。",
  "short": "一番低い板で、水位が決まる樽。",
  "article": "forest",
  "controls": [
   {
    "key": "a",
    "label": "資源Aの充足度",
    "min": 10,
    "max": 100,
    "value": 80,
    "unit": "%",
    "step": 1,
    "type": "range"
   },
   {
    "key": "b",
    "label": "資源Bの充足度",
    "min": 10,
    "max": 100,
    "value": 35,
    "unit": "%",
    "step": 1,
    "type": "range"
   },
   {
    "key": "c",
    "label": "資源Cの充足度",
    "min": 10,
    "max": 100,
    "value": 70,
    "unit": "%",
    "step": 1,
    "type": "range"
   }
  ],
  "prompt": "Aだけを上げた後で、一番低いBを上げてみてください。",
  "explain": "三つの板のうち、一番低い板の高さまでしか水はたまりません。成長を制約する資源を考える「最小律」の比喩です。この模型は最小値だけで上限が決まるため、不足していない側を増やしても表示は変わりません。",
  "limit": "成長量の実測値ではなく、最小律の理想化した樽の模型。実際の生物では資源同士の相互作用などもあり、あらゆる条件で最小値だけが成長を決めるわけではありません。",
  "preset": {
   "a": 100
  },
  "references": [
   {
    "name": "理化学研究所：増殖法則とリービッヒの最小律",
    "url": "https://www.riken.jp/press/2025/20251010_1/index.html",
    "language": "ja"
   }
  ],
  "checked": "2026-11-25"
 },
 {
  "id": "pendulum",
  "group": "科学と偶然",
  "title": "振り子のリズム",
  "short": "ひもの長さと、一往復の時間。",
  "article": "wave",
  "controls": [],
  "prompt": "一つの条件だけを変えて、違いを眺めてみましょう。",
  "explain": "元からある実験も、ここから続けて遊べます。長さ、背景、回数。操作した条件と変わった結果を結びつけて見ると、小さな発見が残ります。",
  "limit": "それぞれの画面に、模型の条件と適用範囲を表示しています。",
  "preset": {},
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "illusion",
  "group": "科学と偶然",
  "title": "同じ灰色、違う灰色",
  "short": "色は、周りとの関係でも見えている。",
  "article": "color",
  "controls": [],
  "prompt": "一つの条件だけを変えて、違いを眺めてみましょう。",
  "explain": "元からある実験も、ここから続けて遊べます。長さ、背景、回数。操作した条件と変わった結果を結びつけて見ると、小さな発見が残ります。",
  "limit": "それぞれの画面に、模型の条件と適用範囲を表示しています。",
  "preset": {},
  "references": [],
  "checked": "2026-11-25"
 },
 {
  "id": "chance",
  "group": "科学と偶然",
  "title": "偶然を眺める",
  "short": "10回と1000回では、何が違う？",
  "article": "chance",
  "controls": [],
  "prompt": "一つの条件だけを変えて、違いを眺めてみましょう。",
  "explain": "元からある実験も、ここから続けて遊べます。長さ、背景、回数。操作した条件と変わった結果を結びつけて見ると、小さな発見が残ります。",
  "limit": "それぞれの画面に、模型の条件と適用範囲を表示しています。",
  "preset": {},
  "references": [],
  "checked": "2026-11-25"
 }
];
