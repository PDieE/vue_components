const zhCN = {
  /** 通用文案 */
  common: {
    cancel: '取消',
    close: '关闭',
    confirm: '确认',
    loading: '加载中',
    noData: '暂无数据',
    ok: '确定',
    reset: '重置',
    retry: '重试',
    search: '搜索',
    unknown: '未知',
  },
  /** UiCombobox, UiComboboxCascader */
  combobox: {
    noResults: '无结果',
    placeholder: '请选择',
  },
  /** UiCommandDialog */
  command: {
    description: '搜索要执行的命令…',
    title: '命令面板',
  },
  /** UiDataTable */
  dataTable: {
    collapse: '收起节点',
    expand: '展开节点',
    selectAll: '选择全部',
    selectRow: '选择行',
  },
  /** UiDatePicker, UiDatePickerRange */
  datePicker: {
    end: '结束日期',
    placeholder: '请选择日期',
    start: '开始日期',
  },
  /** UiFilterFormContent, UiFilterFormMore, UiFilterFormTagContent */
  filterForm: {
    active: '筛选项：',
    results: '查看结果',
    title: '筛选项',
  },
  /** UiInputApp */
  input: {
    hidePassword: '隐藏密码',
    showPassword: '显示密码',
  },
  /** UiMapSelect, UiMapSelectContainer */
  mapSelect: {
    description:
      '点击地图直接选点，或在左上角搜索框输入地点名称进行快速定位，确认后点击“确定”即可完成选择',
    dragged: '手动选择位置',
    failed: '选择失败',
    locating: '正在获取位置信息',
    placeholder: '从地图选择地址',
    search: '搜索位置、地点',
    selected: '选择的位置',
    title: '地址选择',
    unavailable: '地图未加载',
  },
  /** UiPaginationApp 及分页按钮 */
  pagination: {
    ellipsis: '更多页',
    first: '首页',
    last: '末页',
    next: '下一页',
    perPage: '{count} 条/页',
    previous: '上一页',
  },
  /** UiRichEditor */
  richEditor: {
    addImage: '添加图片',
    bold: '加粗',
    bulletList: '无序列表',
    clearFormatting: '清除格式',
    clearNodes: '清除节点',
    codeBlock: '代码块',
    hardBreak: '强制换行',
    heading: '标题 {level}',
    headingMenu: '段落/标题',
    horizontalRule: '分割线',
    inlineCode: '行内代码',
    italic: '斜体',
    orderedList: '有序列表',
    paragraph: '段落',
    placeholder: '请输入内容',
    quote: '块引用',
    redo: '重做',
    strike: '删除线',
    textColor: '字体颜色',
    undo: '撤销',
  },
  /** UiSidebar, UiSidebarRail, UiSidebarTrigger */
  sidebar: {
    description: '移动端侧边栏',
    title: '侧边栏',
    toggle: '切换侧边栏',
  },
  /** UiSimpleWrapError */
  simpleWrap: {
    loadFailed: '数据获取失败',
  },
  /** UiTimePicker */
  timePicker: {
    now: '此刻',
    placeholder: '请选择时间',
  },
  /** UiUploadDragger, UiUploadImage, UiRichEditorNodeImageUploadComponent */
  upload: {
    anyFile: '支持任意格式',
    anyImage: '支持任意图片格式',
    aspectRatio: '图片比例 {width}:{height}',
    click: '点击上传',
    countReached: '文件数量已达到上限 {count} 份',
    deleteFile: '删除文件',
    deleteImage: '删除图片',
    deleteVideo: '删除视频',
    download: '下载文件',
    drop: '点击或拖拽文件到此处上传',
    failed: '文件上传失败',
    imageFailed: '图片上传失败',
    imageSizeLimit: '文件大小不超过{size}',
    invalidRatio: '{name} 的比例不符合 {width}:{height}',
    invalidType: '{name} 的类型不符合要求',
    listSeparator: '，',
    maxCount: '文件数量不可超过 {count} 份',
    maxDimensions: '图片尺寸不大于 {width}×{height}px',
    maxHeight: '{name} 高度大于 {height}px',
    maxWidth: '{name} 宽度大于 {width}px',
    minDimensions: '图片尺寸不小于 {width}×{height}px',
    minHeight: '{name} 高度小于 {height}px',
    minWidth: '{name} 宽度小于 {width}px',
    missingFile: '文件不存在',
    playVideo: '播放视频',
    replace: '重新上传',
    retry: '点击重试',
    sizeExceeded: '{name} 超过 {size}',
    sizeLimit: '最大{size}',
    tipSeparator: '；',
    types: '支持{types}',
    typesAndLimit: '支持{types}{limit}',
    unknownFile: '未知文件',
    uploadFile: '上传文件',
    uploadImage: '上传图片',
    uploadVideo: '上传视频',
    video: '视频',
    viewImage: '查看图片',
  },
} as const

export { zhCN }
export default zhCN
