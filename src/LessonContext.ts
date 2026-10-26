import {createContext,useContext} from 'react';
import {getLesson} from '../shared/lessons.mjs';
export const LessonContext=createContext(getLesson());
export const useLesson=()=>useContext(LessonContext);
