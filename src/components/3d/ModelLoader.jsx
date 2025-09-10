"use client";

import GLBModel from './GLBModel'

const ModelLoader = (props) => {
    const { model_name } = props
    const isGLB = model_name.toLowerCase().endsWith('.glb')

    return <GLBModel {...props} path={model_name} />
}

export default ModelLoader
