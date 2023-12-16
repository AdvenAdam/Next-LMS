'use client'

import { Category } from '@prisma/client'
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
  FcHome,
} from 'react-icons/fc'
import { IconType } from 'react-icons'
import CategoryItem from './category-item'

interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<Category['name'], IconType> = {
  Music: FcMusic,
  Fitness: FcSportsMode,
  Photography: FcOldTimeCamera,
  Action: FcFilmReel,
  Language: FcSalesPerformance,
  'Computer Science': FcMultipleDevices,
  Engineering: FcEngineering,
  Cooking: FcHome,
}
export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map(item => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}
