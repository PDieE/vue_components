import type { UiMessages } from './types'

export const enUS = {
  /** Shared messages */
  common: {
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading',
    noData: 'No data',
    ok: 'Confirm',
    reset: 'Reset',
    retry: 'Retry',
    search: 'Search',
    unknown: 'Unknown',
  },
  /** UiCombobox, UiComboboxCascader */
  combobox: {
    noResults: 'No results',
    placeholder: 'Select an option',
  },
  /** UiCommandDialog */
  command: {
    description: 'Search for a command to run...',
    title: 'Command Palette',
  },
  /** UiDataTable */
  dataTable: {
    collapse: 'Collapse row',
    expand: 'Expand row',
    selectAll: 'Select all',
    selectRow: 'Select row',
  },
  /** UiDatePicker, UiDatePickerRange */
  datePicker: {
    end: 'End date',
    placeholder: 'Select a date',
    start: 'Start date',
  },
  /** UiFilterFormContent, UiFilterFormMore, UiFilterFormTagContent */
  filterForm: {
    active: 'Filters:',
    results: 'Show results',
    title: 'Filters',
  },
  /** UiInputApp */
  input: {
    hidePassword: 'Hide password',
    showPassword: 'Show password',
  },
  /** UiMapSelect, UiMapSelectContainer */
  mapSelect: {
    description: 'Click the map or search for a place in the top left, then click Confirm.',
    dragged: 'Manually selected location',
    failed: 'Could not select the location',
    locating: 'Getting location',
    placeholder: 'Select an address on the map',
    search: 'Search for a location',
    selected: 'Selected location',
    title: 'Select an address',
    unavailable: 'The map has not loaded',
  },
  /** UiPaginationApp and pagination controls */
  pagination: {
    ellipsis: 'More pages',
    first: 'First page',
    last: 'Last page',
    next: 'Next page',
    perPage: '{count} per page',
    previous: 'Previous page',
  },
  /** UiRichEditor */
  richEditor: {
    addImage: 'Add image',
    bold: 'Bold',
    bulletList: 'Bulleted list',
    clearFormatting: 'Clear formatting',
    clearNodes: 'Clear block formatting',
    codeBlock: 'Code block',
    hardBreak: 'Line break',
    heading: 'Heading {level}',
    headingMenu: 'Paragraph / Heading',
    horizontalRule: 'Horizontal rule',
    inlineCode: 'Inline code',
    italic: 'Italic',
    orderedList: 'Numbered list',
    paragraph: 'Paragraph',
    placeholder: 'Enter content',
    quote: 'Blockquote',
    redo: 'Redo',
    strike: 'Strikethrough',
    textColor: 'Text color',
    undo: 'Undo',
  },
  /** UiSidebar, UiSidebarRail, UiSidebarTrigger */
  sidebar: {
    description: 'Displays the mobile sidebar.',
    title: 'Sidebar',
    toggle: 'Toggle sidebar',
  },
  /** UiSimpleWrapError */
  simpleWrap: {
    loadFailed: 'Could not load data',
  },
  /** UiTimePicker */
  timePicker: {
    now: 'Now',
    placeholder: 'Select a time',
  },
  /** UiUploadDragger, UiUploadImage, UiRichEditorNodeImageUploadComponent */
  upload: {
    anyFile: 'All file formats are supported',
    anyImage: 'All image formats are supported',
    aspectRatio: 'Image aspect ratio: {width}:{height}',
    click: 'Click to upload',
    countReached: 'The limit of {count} files has been reached',
    deleteFile: 'Delete file',
    deleteImage: 'Delete image',
    deleteVideo: 'Delete video',
    download: 'Download file',
    drop: 'Click or drag files here to upload',
    failed: 'File upload failed',
    imageFailed: 'Image upload failed',
    imageSizeLimit: 'File size must not exceed {size}',
    invalidRatio: '{name} does not match the {width}:{height} aspect ratio',
    invalidType: '{name} has an unsupported file type',
    listSeparator: ', ',
    maxCount: 'Select up to {count} files',
    maxDimensions: 'Maximum image dimensions: {width}×{height}px',
    maxHeight: '{name} is taller than {height}px',
    maxWidth: '{name} is wider than {width}px',
    minDimensions: 'Minimum image dimensions: {width}×{height}px',
    minHeight: '{name} is shorter than {height}px',
    minWidth: '{name} is narrower than {width}px',
    missingFile: 'File is missing',
    playVideo: 'Play video',
    replace: 'Replace file',
    retry: 'Click to retry',
    sizeExceeded: '{name} exceeds {size}',
    sizeLimit: 'Maximum size: {size}',
    tipSeparator: '; ',
    types: 'Supported formats: {types}',
    typesAndLimit: 'Supported formats: {types} {limit}',
    unknownFile: 'Unknown file',
    uploadFile: 'Upload file',
    uploadImage: 'Upload image',
    uploadVideo: 'Upload video',
    video: 'Video',
    viewImage: 'View image',
  },
} as const satisfies UiMessages
