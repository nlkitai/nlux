 
export type PromptState = {
  selectContext: boolean
  files: string[] | '@workspace'
  currentSelection: 'workspace' | 'currentFile' | 'allOpenedFiles' | ''
}

export type PromptAction = {
  type: 'CURRENT_FILE'
  payload: {
    file: string
    selection: 'workspace' | 'currentFile' | 'allOpenedFiles'
    selectContext: boolean
  }
} | {
  type: 'ALL_OPENED_FILES'
  payload: {
    files: string[]
    selection: 'workspace' | 'currentFile' | 'allOpenedFiles'
    selectContext: boolean
  }
} | {
  type: 'WORKSPACE'
  payload: {
    files: '@workspace'
    selection: 'workspace' | 'currentFile' | 'allOpenedFiles'
    selectContext: boolean
  }
} | {
  type: 'ADD_CONTEXT'
  payload: boolean
} | {
  type: 'REMOVE_FILE'
  payload: string
} | {
  type: 'REMOVE_ALL_FILES'
}

export const initialState: PromptState = {
  selectContext: false,
  currentSelection: '',
  files: [],
}

export const stripFileName = (file: string) => {
  return file.split('/').pop()
}

export function promptReducer(state:PromptState, action: PromptAction): PromptState {
  switch (action.type) {
  case 'CURRENT_FILE':
    return { 
      ...state, 
      files: Array.isArray(state.files) ? [...state.files, stripFileName(action.payload.file) || ''] : [stripFileName(action.payload.file) || ''], 
      currentSelection: action.payload.selection, 
      selectContext: action.payload.selectContext 
    }
  case 'ALL_OPENED_FILES':
    return { 
      ...state, 
      files: action.payload.files.map(file => stripFileName(file) || ''), 
      currentSelection: action.payload.selection, 
      selectContext: action.payload.selectContext 
    }
  case 'WORKSPACE':
    return { ...state, files: '@workspace', currentSelection: 'workspace', selectContext: action.payload.selectContext }
  case 'ADD_CONTEXT':
    return { ...state, selectContext: action.payload }
  case 'REMOVE_FILE':
    return {
      ...state,
      files: Array.isArray(state.files) ? state.files.filter((file) => file !== action.payload) : []
    }
  case 'REMOVE_ALL_FILES':
    return { ...state, files: [], currentSelection: '', selectContext: false }
  default:
    return state
  }
}
