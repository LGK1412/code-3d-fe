import { proxy } from 'valtio'

export const modes = ['translate', 'rotate']

export const state = proxy({
  current: null, // id model đang chọn
  mode: 0, // 0: translate, 1: rotate, 2: scale
  deleteMode: false,
})