# Windsor OSM 本地更新流程

版本：2026-10-28。范围：加拿大安大略省 Windsor 全市行政边界。入口是 LOCAL-WORKFLOW.html；给 Hackforge 的英文说明见 LOCAL-WORKFLOW.en.md。本包是本地分析和人工审核工具，不会自动登录或写入 OSM。

## 先选你要做的事

| 需求 | 打开什么 | 需要什么 |
|---|---|---|
| 看上一轮全市结果 | windsor-review-map.html | 浏览器 |
| 审核上一轮 40 个 crossing 节点，准备小批修改 | START-HERE.html | 浏览器；导出前联网；最终用 JOSM |
| 检查 9 个重点地点的道路和步道连接 | josm-sites/ 中对应 .osm | JOSM；编辑前刷新周边数据 |
| 用最新数据重新跑全市对比 | refresh/RUN-UPDATE.cmd | Windows、Node.js 22 或更新版本、网络；首次先核对 sources-config.json |
| 用已保存的原始数据重现一次分析 | refresh/refresh.mjs 的 --input 模式 | Node.js；不需要联网 |

**旧 40 节点审核器和 9 个重点地点说明属于 2026-10-27 分析快照。重新跑全市分析不会自动刷新这些人工备注或批准。** 新一轮请从 runs/ 下的新结果开始检查，再在 JOSM 使用最新对象编辑。

## 第一步：准备输入和软件

解压完整包到本机普通文件夹。查看和审核只需要浏览器；实际上传用 [JOSM](https://josm.openstreetmap.de/)。重跑分析另外需要 [Node.js](https://nodejs.org/)，不需要安装第三方代码依赖。

重跑所需程序文件都在 refresh/：RUN-UPDATE.cmd、refresh.mjs、compare.mjs、sources-config.json。下载程序、源目录和阈值都留在包内，不再依赖原作者的电脑路径。

| 本地原始文件 | 作用 | 核心比对还是辅助资料 |
|---|---|---|
| Boundaries-0.geojson | 限定 Windsor 市界，排除 Detroit 等邻近区域 | 核心 |
| Transportation-23.geojson | 市政道路名称、中心线、限速；定位 PXO 路口参考点 | 核心 |
| Transportation-4.geojson | 自行车停车设施 | 核心 |
| Transportation-11.geojson | 充电站库存 | 核心 |
| CommunityRecreation-12.geojson | 公园厕所库存和状态 | 核心 |
| Transportation-8.geojson | 护学员位置和学年 | 辅助；不代表有标线或信号 |
| Transportation-22.geojson、Transportation-3.geojson | 人行道、自行车道 | 本轮仅库存/字段审阅，未做完整逐段比对 |
| PlanningDevelopment-0/5/6.geojson | 主动交通、道路、人行道工程状态 | 辅助；规划不能当作建成 |
| PlanningDevelopment-10.geojson | 遗产点 | 本轮仅库存/字段审阅 |
| osm.json | OSM crossing、道路及三类设施，含 ID、版本、标签、几何 | 核心 |
| manifest.json、各层 -meta.json | 来源 URL、下载时间、数量、字段定义 | 溯源和完整性检查 |
| sources-config.json 中 pxo_pairs | 从 City PXO 页面人工维护的地点列表 | 每次更新都要复核网页，当前并非自动抓取 |

当前重跑程序要求 12 个市政图层全部到齐。成功下载后，每个 run 的 raw/ 保存这些输入。另保留人工照片、街景图片编号、现场记录、来源许可依据；填入 evidence-register.csv，不要把现场证据塞进 OSM 的业务标签。

## 第二步：刷新数据，保留上一轮

1. 打开 sources-config.json，检查各图层 URL、查询范围和 PXO 地点列表。官方 PXO 页面若有新增/撤除，应先更新列表和 pxo_source_last_checked；仅修改日期不算完成核验。
2. Windows 双击 RUN-UPDATE.cmd。其他系统在 refresh/ 运行 node refresh.mjs。
3. 程序按记录 ID 分页获取市政数据，检查总数量、ID 成员和截断标志，输出 WGS84 经纬度。随后下载 OSM；若快照超过 48 小时、时间缺失或服务报错就停止。
4. 新结果写入 runs/时间戳/，保留旧目录。遇到 429 等错误，遵守服务给出的等待时间，稍后重试；不连续轰炸接口，也不把旧数据伪装成最新数据。
5. 检查 run-manifest.json 的 completed=true。FAILED.json 表示该轮未完成，不作为新报告交付。

需要与上一轮比较时，在 refresh/ 运行：

```text
node refresh.mjs --previous "../windsor-review.geojson"
```

以后把 --previous 改为上一次成功 run/results/windsor-review.geojson。重现保存数据时：

```text
node refresh.mjs --input "原始数据文件夹" --output "一个不存在的新结果文件夹" --previous "上一轮GeoJSON路径"
```

--input 明确标记为 SAVED_SNAPSHOT_REPLAY，不声称重新取得最新数据。输入含 osm.json、manifest.json 和 12 个图层。程序拒绝覆盖已存在的结果目录。

## 第三步：怎么比对

| 对象 | 当前实现的方法 | 结果意味着什么 |
|---|---|---|
| 单个 crossing 节点 | 检查 unmarked 与实际标线标签、traffic_signals 与 signals=no 等内部冲突 | 标签有矛盾，还不知道哪一个符合现场 |
| crossing 节点与 crossing 线 | 按共享节点 ID 检查标签差异 | 可能冲突，也可能不同路臂本来不同 |
| crossing 连接 | 检查是否与下载到的车行道路共用节点 | 需要查连接；不能据此删除 |
| 自行车架、充电站、厕所 | 同类设施最近距离；35 m 内近匹配、35–150 m 模糊、150 m 内未匹配为候选缺口 | 距离用于分流，不证明是同一个设施或一定缺失 |
| 市政充电站自身质量 | 找 1 m 内坐标重合的记录；核对设备与站点的粒度 | 一行市政记录不一定对应一个 OSM 站点 |
| 厕所状态 | Closed 单独标记，不作为开放厕所新增 | 还需确认建筑现用途 |
| 道路限速 | 标准化同名道路；中点附近 12 m 筛选，首/中/末点均在对应 OSM way 的 15 m 内 | 只标差异，最终需要当前限速牌和适用范围 |
| 官方 PXO | 用道路交会定位参考点，检查 85 m 内 crossing；尽量匹配道路名称 | 参考点不是新建 crossing 坐标；附近已有点不证明该路臂已画好 |

本轮距离使用局部近似米制换算；点按市界筛选，线采用“至少一个顶点在市界内”的入选规则，并非严格几何裁剪。三类设施的全市匹配主要覆盖 nodes/ways，未完整覆盖 relations 或非标准标签。每个拟修改地点都应另查当前完整局部地图。

相似路口的严格定义应包括同一辖区、道路等级、十字/丁字/环岛形态、车道/中央分隔、岛、连接、标线、行人信号、黄闪灯和设施日期。现有 5 组只按可用标签分组，没有自动识别全部几何条件。相似性帮助安排核验顺序，不自动赋值或批准。

## 第四步：哪些设施和来源可以交叉核验

| 类别 | 可以查的第二/第三来源 | 实际核验字段 | 注意 |
|---|---|---|---|
| Crossing / PXO | City PXO 地点照片、实地照片、允许用于 OSM 的 Mapillary 街景 | 哪一条路臂、有无/什么标线、行人信号还是黄闪灯、按钮、岛 | City 网页和 GIS 是同一发布者；照片日期和视角要明确 |
| 人行道/无障碍 | 实地观察、许可街景、工程完工记录 | 连接、坡道、kerb、tactile_paving、隔离栏、可通行情况 | 路缘属性标在正确的位置；规划图不能证明建成 |
| 充电站 | 场地方/运营商公告、现场设备铭牌、运营商当期站点信息 | 是否仍运营、准确位置、站点/设备数、接口、容量、开放限制 | 运营商页面可帮助核实事实，复制到 OSM 仍需许可；2023 公告不证明 2026 收费 |
| 自行车停车 | 现场照片、设施所在场所说明、许可街景 | 架型、数量、容量、遮盖、入口 | 公共场所旁不等于完全开放；容量不要从模糊照片猜 |
| 公园厕所 | 公园当前项目页、设施开放公告、现场门牌/开放时间 | 开放/关闭/拆除、季节性、无障碍 | 库存可能陈旧；地图上有建筑不代表厕所开放 |
| 道路限速 | 当前现场标牌、有效的市政道路规定及其修订 | 数值、单位、生效区间、方向、时段/学校区 | 设计速度不是限速，不能推广整条路 |
| 下一轮可扩展的公园设施 | City 当前公园项目页与独立现场观察 | 饮水点、长椅、垃圾桶、运动场、步道照明 | 当前刷新程序未自动比对这些类别，需另加数据和规则 |
| 遗产/规划 | 市政登记、指定文件、现状调查 | 正确地址、建筑身份、Listed/Designated | 已读库存不等于全部已核验或有权批量导入 |

优先记录“来源具体支持哪一个字段”。OSM 历史可以解释谁在何时为何修改，但不是独立现场证据。多个网站可能只是转载同一份 City 数据，按同一 independence_group 记录。未知信号灯不能填 no；仅看到有按钮也不能填 signals=yes。

本次核过的入口：

- [City PXO 页面](https://www.citywindsor.ca/residents/traffic-and-parking/transportation-planning/pedestrian-crossovers)
- [City 充电站页面](https://www.citywindsor.ca/residents/traffic-and-parking/on-off-street-parking/electric-vehicle-charging-stations)
- [City 公园当前工程](https://www.citywindsor.ca/residents/parks-and-forestry/parks-development/current-projects)
- [ENWIN 设施公告（2023，注意时效）](https://enwin.com/enwin-utilities-ltd-unveils-completed-electric-vehicle-and-charging-stations)
- [Mapillary 对 OSM 使用的说明](https://help.mapillary.com/hc/en-us/articles/115001777705-OpenStreetMap-compatibility)：核对实际图像日期、位置和使用条件；本轮没有声称已查完 Windsor 街景。
- [OSM 来源使用要求](https://www.openstreetmap.org/copyright)：不把 Google Maps/Street View 或其它未获许可的地图内容直接抄入 OSM。

## 第五步：汇总输出到底是哪一个

**每次新 run 的主结果是 results/windsor-review.geojson；适合表格阅读的是 results/windsor-review.csv。真正准备上传的是人工审核后另外导出的 windsor-reviewed-changes.osm。这三者作用不同。**

| 输出 | 内容 | 是否可直接上传 |
|---|---|---|
| results/windsor-review.geojson | 全部候选的坐标、类别、原因、源对象链接、stable_key | 否，审核清单 |
| results/windsor-review.csv | 同一份候选的表格摘要 | 否 |
| results/summary.json | 总数、分类统计、来源时间、覆盖限制 | 否 |
| results/delta-summary.json | 新增、仍存在、本轮未检出的候选 | 否；未检出不等于已修好 |
| results/evidence-register.csv | 人工填写的逐字段证据和决定 | 否 |
| run-manifest.json | 输入校验值、源时间、运行状态、所用配置 | 否 |
| windsor-review-decisions.json | 上一轮 40 节点审核页面保存的工作进度 | 否；只接受对应快照 |
| windsor-reviewed-changes.osm | 审核页面生成的具体节点修改，含原 ID、版本和完整标签 | 在 JOSM 补充上下文并通过检查后提交 |
| windsor-reviewed-changes.osc | 同一组修改的交换格式 | 不是带认证和活动 changeset ID 的直接 API 上传请求 |
| windsor-export-audit.json | 修改前后、证据、审核者、导出检查时间 | 否，溯源记录 |
| changeset URL | JOSM 真正上传成功后取得的服务器记录 | 用来证明实际提交，不由本工具虚构 |

人工优先级、重点地点备注不会在新 run 中自动重新生成；原包的 priority-review.geojson 和交互地图只对应原快照。新输出可在 QGIS/JOSM 打开，筛选已核验的地点再编辑。W00001 等编号每轮可能变化；用 stable_key 追踪候选，同时注意市政 OBJECTID 重编号仍可能影响身份。

## 第六步：审核、上传和回写

先审核 1–5 个地点。确认来源适用于 OSM、所需社区流程已完成、对象身份/位置正确，再在 JOSM 更新到最新版本、检查道路和步道是否正确共用节点、补齐对应 way 修改、运行 Validator。上传时写清实际修改和实际证据来源。上传成功后，把 changeset URL 回填 evidence-register.csv；若失败或没有收到成功结果，不能把本地文件生成当作上传成功。

## 已验证与未验证

保存数据重放已得到 713 条候选，与原包 stable_key 对比：新增 0、仍存在 713、本轮未检出 0。编辑器导出逻辑另有 22 项测试通过。所有这些只验证程序和数据重现。

本轮没有完整执行新的联网下载，也没有验证完整 JOSM 实际上传；新下载可能遇到服务限流或字段变化。没有新增现场核验、来源许可批准或实际 OSM 上传。测试产物和原始大文件未打入本分发包；重跑会下载原始文件。
