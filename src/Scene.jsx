import {useEffect,useRef} from 'react';
import {createEngine} from './engine';
export default function Scene({api,onZone,onAction,onReady,onMessage}){const host=useRef();useEffect(()=>{let engine;try{engine=createEngine(host.current,{onZone,onAction,onReady,onMessage});api.current=engine}catch(error){console.error(error);onMessage('三维场景加载失败，请使用支持 WebGL 的浏览器重试。')}return()=>engine?.dispose()},[]);return <div ref={host} className="scene" aria-label="可交互三维基地场景"/>}
