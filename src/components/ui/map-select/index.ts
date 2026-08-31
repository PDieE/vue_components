/* eslint-disable @typescript-eslint/no-explicit-any -- Public AMap SDK objects are dynamically typed. */
export { default as MapSelect } from './MapSelect.vue'
export { default as MapSelectContainer } from './MapSelectContainer.vue'

export interface MapSelectValue {
  /** 地区编码 */
  adcode?: string
  /** 省份 */
  province?: string
  /** 城市 */
  city?: string
  /** 区域 */
  district?: string
  /** 街道 */
  township?: string
  /** 详细地址 */
  address?: string
  /** 格式化地址（省市区街道） */
  formattedAddress?: string
  /** 经度 */
  longitude?: number
  /** 纬度 */
  latitude?: number
}

export type LocationLatLng = [number, number]

export interface AMapSearchResult {
  id: string
  name: string
  district: string
  adcode: string
  location: LocationLatLng
  address: string
  typecode: string
  city: any[] // 可以根据具体的数据结构进一步定义
}

export type Pos = [number, number]
export type Position = Vector2 | LngLat

export interface LngLat {
  KL: number
  className: string
  kT: number
  lat: number
  lng: number
  pos: Pos
}

// 定义 Vector2 和 Pixel 类型（根据需要进行具体定义）
export type Vector2 = [number, number]
export type Pixel = [number, number] & {
  x: number
  y: number
  className: string
}

export interface MarkerLabel {
  content: string // 文本标注的内容
  offset: Pixel | Vector2 | number[] // 偏移量
  direction?: 'top' | 'right' | 'bottom' | 'left' | 'center' // 文本标注方位
}

export interface MarkerOptions {
  map?: Map<string, any> // 要显示该marker的地图对象
  position: Position // 点标记在地图上显示的位置
  content?: string | HTMLElement // 点标记显示内容
  title?: string // 鼠标滑过点标记时的文字提示
  visible?: boolean // 点标记是否可见
  zIndex?: number // 点标记的叠加顺序
  offset?: Vector2 | Pixel // 点标记显示位置偏移量
  anchor?: string | Vector2 // 设置点标记锚点
  angle?: number // 点标记的旋转角度
  clickable?: boolean // 点标记是否可点击
  draggable?: boolean // 点标记是否可拖拽
  bubble?: boolean // 事件是否冒泡
  zooms?: Vector2 // 点标记显示的层级范围
  cursor?: string // 鼠标悬停时的鼠标样式
  topWhenClick?: boolean // 鼠标点击时marker是否置顶
  height?: number // Marker点离地绘制的高度
  label?: MarkerLabel // 添加文本标注
  extData?: any // 用户自定义属性
}

export interface MarkersMap {
  position: Position
  marker: any
  markerId: string // 一般由 lat, lng 作为 map 的唯一 key
}

// 事件声明
export interface MapEvent {
  lnglat: LngLat
  originEvent: MouseEvent
  pixel: Pixel
  pos: Pos
  target: any
  type: string
  vectorIndex: number
}
