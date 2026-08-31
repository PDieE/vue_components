/* eslint-disable @typescript-eslint/no-explicit-any -- The AMap SDK exposes dynamic, untyped objects. */
import AMapLoader from '@amap/amap-jsapi-loader'
import { merge } from 'es-toolkit'
import { isArray, uniqueId } from 'es-toolkit/compat'
import qs from 'qs'

import type { LngLat, MapEvent, MarkerOptions, MarkersMap, Position } from './'

type AmapServiceEvent = {
  onMapClick: [MapEvent]
  onMarkerClick: [MapEvent, any]
  onMarkerDrag: [MapEvent, MarkersMap]
}

type EventHandler<T extends any[]> = (...args: T) => void

type EventsMap = Record<string, any[]>

class EventEmiter<T extends EventsMap = EventsMap> {
  private events: { [K in keyof T]?: EventHandler<T[K]>[] } = {}

  /**
   * 添加指定事件的事件监听器。
   * @param {K} eventName - 要监听的事件名称。
   * @param {EventHandler} callback - 事件触发时要调用的回调函数。
   */
  on<K extends keyof T>(eventName: K, callback: EventHandler<T[K]>): void {
    if (!this.events[eventName]) this.events[eventName] = []
    this.events[eventName]!.push(callback)
  }

  /**
   * 添加一次性事件监听器，监听器将在事件触发后自动移除。
   * @param {K} eventName - 要监听的事件名称。
   * @param {EventHandler} callback - 事件触发时要调用的回调函数。
   */
  once<K extends keyof T>(eventName: K, callback: EventHandler<T[K]>): void {
    const onceCallback: EventHandler<T[K]> = (...args: T[K][]) => {
      callback(...(args as T[K]))
      this.off(eventName, onceCallback)
    }
    this.on(eventName, onceCallback)
  }

  /**
   * 移除指定事件的事件监听器。
   * @param {K} eventName - 要从中删除监听器的事件名称。
   * @param {EventHandler} callback - 要删除的回调函数。
   */
  off<K extends keyof T>(eventName: K, callback: EventHandler<T[K]>): void {
    const callbacks = this.events[eventName]
    if (callbacks) {
      this.events[eventName] = callbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * 触发指定事件并调用所有已订阅的事件监听器。
   * @param {K} eventName - 要触发的事件的名称。
   * @param {...any} args - 要传递给事件监听器的可选参数。
   */
  emit<K extends keyof T>(eventName: K, ...args: T[K]): void {
    const callbacks = this.events[eventName]
    if (callbacks) {
      for (const callback of callbacks) {
        callback(...args)
      }
    }
  }

  /**
   * 移除指定事件的所有监听器。
   * @param {K} eventName - 要移除监听器的事件名称。
   */
  removeNameListeners<K extends keyof T>(eventName: K): void {
    delete this.events[eventName]
  }

  /**
   * 移除所有监听器。
   */
  removeAllListeners(): void {
    this.events = {}
  }

  /**
   * 销毁事件发射器，移除所有监听器并清除所有事件。
   */
  dispose(): void {
    this.removeAllListeners()
  }
}

const aMapKey = '6b342ef0a0bc008d7c3831aab7e4f4d1'
const aMapSecurityKey = '8712ec1f8864c180abafddd4616877df'
export class AmapService extends EventEmiter<AmapServiceEvent> {
  private AMap: any = null
  private _autoComplete: any = null
  private _geocoder: any = null
  // 地图容器
  private _mapContainer: any = null

  private markers = new Map<string, MarkersMap>()

  constructor() {
    super()
  }

  // 初始化地图实例
  public async startup() {
    try {
      this.AMap = await AmapStateManager.getInstance().startup()
      return this.AMap
    } catch (error) {
      console.error('初始化地图失败', error)
      return Promise.reject(error)
    }
  }

  get map() {
    return this._mapContainer
  }

  public safeStringify(obj: unknown) {
    const cache = new WeakSet()

    const stringified = JSON.stringify(obj, (key, value) => {
      // 循环引用检测
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return // 处理循环引用
        }
        cache.add(value)
      }
      return value
    })

    return stringified
  }

  // 地图容器渲染
  public renderMap(divName: string, options: any = {}) {
    if (this._mapContainer) {
      return
    }
    this._mapContainer = new this.AMap.Map(divName, options)
    // 注册监听事件
    this.registerMapEvent()
  }

  // 注册地图监听事件
  public registerMapEvent() {
    this._mapContainer.on('click', (e: any) => {
      this.emit('onMapClick', e)
    })
  }

  // 添加 marker 标记
  public createMarker(params: MarkerOptions, extData: any = {}, markerId?: string): MarkersMap {
    markerId = markerId || uniqueId('marker_')
    const position = this.formartPosition(params.position)
    // const lng = position.lng
    // const lat = position.lat
    const _markerMap = this.markers.get(markerId)
    if (_markerMap) {
      return _markerMap
    }
    // 创建 marker
    const marker = new this.AMap.Marker({
      ...params,
      position,
      extData: {
        ...extData,
        markerId,
      },
    })
    this._mapContainer.add(marker)
    const markerMap = {
      marker,
      markerId,
      position,
    }
    this.markers.set(markerId, markerMap)
    this.registerMarkerEvent(markerMap)
    return markerMap
  }

  // 获取指定的 marker
  public getMarker(markerId: string): MarkersMap | undefined {
    return this.markers.get(markerId)
  }

  // 设置 map 的中心点
  public setCenter(position: Position) {
    const lnglat = this.formartPosition(position)
    this._mapContainer.setCenter(lnglat, false, 300)
  }

  // 注册 marker 事件
  public registerMarkerEvent(markerMap: MarkersMap) {
    const marker = markerMap.marker
    marker.on('dragend', (e: any) => {
      console.log('dragend', '拖拽结束', e, marker)
      const offset = new this.AMap.Pixel(0, -5)
      this.emit('onMarkerDrag', e, markerMap)
      marker.setLabel({
        content: '手动选择位置',
        direction: 'top',
        offset,
      })
    })
  }

  // 清除所有 marker 标记
  public clearMarkers() {
    this.markers.forEach((marker) => {
      this._mapContainer.remove(marker.marker)
    })
    this.markers.clear()
  }

  // 获取 marker 标记的 经纬度 因为 params 里面里面可以是数组也可以是对象
  private formartPosition(position: Position): LngLat {
    if (isArray(position)) {
      return this.LngLat(position[0], position[1])
    } else {
      return position
    }
  }

  public removeMarker(markerId: string) {
    const marker = this.markers.get(markerId)
    if (marker) {
      this._mapContainer.remove(marker)
      this.markers.delete(markerId)
    }
  }

  // 创建经纬度
  public LngLat(lng: number, lat: number, noWrap: boolean = false): LngLat {
    return new this.AMap.LngLat(lng, lat, noWrap)
  }

  // 添加默认控件
  public addDefaultControls() {
    if (!this._mapContainer) {
      return
    }
    // 添加工具条
    const scale = new this.AMap.Scale({
      position: 'LB',
    })
    this._mapContainer.addControl(scale)
    // 添加比例尺
    const tool = new this.AMap.ToolBar({
      position: 'RB',
    })
    this._mapContainer.addControl(tool)
  }

  // 获取地图实例
  get getAMap() {
    return this.AMap
  }

  // 初始化搜索插件
  public search(v: string): Promise<any> {
    // 先判断有没有初始化插件
    if (!this._autoComplete) {
      this._autoComplete = new this.AMap.AutoComplete()
    }
    return new Promise((resolve, reject) => {
      if (!v) {
        return resolve({
          count: 0,
          info: 'OK',
          tips: [],
        })
      }

      this._autoComplete.search(v, (status: string, result: any) => {
        if (status === 'complete') {
          resolve(result)
        } else {
          reject(result)
        }
      })
    })
  }

  // 逆地理编码
  public geocoder(params: any) {
    if (!this._geocoder) {
      this._geocoder = new this.AMap.Geocoder({
        extensions: 'all',
      })
    }
    return new Promise((resolve, reject) => {
      this._geocoder.getAddress(params, (status: string, result: any) => {
        if (status === 'complete') {
          resolve(result)
        } else {
          reject(result)
        }
      })
    })
  }

  // 获取所有 marker
  get getMarkers() {
    return Array.from(this.markers.values())
  }

  public destroy() {
    if (this._mapContainer) {
      this._mapContainer.destroy()
    }
    console.log('销毁地图实例')
    // this.AMap.destroy() // 如果 AMap 有 destroy 方法
    this._mapContainer = null
    this._autoComplete = null
    this._geocoder = null
    this.AMap = null
    super.dispose()
  }
}

// 一个单列用于存储地图初始化的对象
export class AmapStateManager {
  private static _instance: AmapStateManager
  private _AMap: any

  private constructor() {}

  public static getInstance() {
    if (!this._instance) {
      this._instance = new AmapStateManager()
    }
    return this._instance
  }

  // 初始化地图实例
  public async startup() {
    try {
      if (this._AMap) {
        return Promise.resolve(this._AMap)
      }

      this.setSecurityJsCode(aMapSecurityKey)
      this._AMap = await AMapLoader.load({
        key: aMapKey,
        version: '2.0',
        plugins: [
          'AMap.Scale', // 比例尺
          'AMap.PlaceSearch', // 地点查询
          'AMap.ToolBar', // 工具条
          'AMap.AutoComplete', // 搜索提示
          'AMap.Geocoder', // 地理编码
          'AMap.InfoWindow', // 信息窗体
          'AMap.Label',
        ],
      })

      // 初始化地图

      return this._AMap
    } catch (error) {
      console.error('初始化地图失败', error)
      return Promise.reject(error)
    }
  }
  // 设置地图安全密钥
  public setSecurityJsCode(code: string) {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: code,
    }
  }

  get AMap() {
    return this._AMap
  }
}

export class AmapApiManager {
  // api地址
  private static readonly webApiUrl = 'https://restapi.amap.com/v3'
  // web服务key
  private readonly webKey = aMapKey

  // 获取逆地理编码
  public async getRegeo(params: {
    location: string
    poitype?: string
    radius?: number
    extensions?: string
    roadlevel?: number
  }): Promise<any> {
    return this.request('/geocode/regeo', params)
  }

  // 搜索关键字
  public async search(params: {
    keywords: string
    types?: string
    city?: string
    children?: number
    offset?: number
    page?: number
    extensions?: 'all' | 'base'
  }) {
    return this.request('/place/text', params)
  }

  // 提取请求
  private async request(url: string, params: any): Promise<any> {
    try {
      const requestUrl = `${AmapApiManager.webApiUrl}${url}`
      const queryParams = qs.stringify(merge({}, { ...this.key, ...params }))
      const response = await fetch(`${requestUrl}?${queryParams}`)
      const data = await response.json()
      if (data.status === '1') {
        return data
      } else {
        throw new Error(data.info)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      throw error
    }
  }

  // 默认的 key 参数
  get key() {
    return {
      key: this.webKey,
    }
  }
}
