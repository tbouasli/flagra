import { sanityClient } from "sanity:client"
import imageUrlBuilder from '@sanity/image-url'

import { Carousel as CarouselComponent, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ArrowRight } from "lucide-react"
import type { Collection } from "@/types"


interface Props {
    collections: Collection[]
}

export default function Carousel({ collections }: Props) {
    const builder = imageUrlBuilder(sanityClient)

    
    return <CarouselComponent
        opts={{
            align: "start",
            loop: true,
        }}
        className="w-full max-h-96"
    >
        <CarouselContent >
            {collections.map((collection, index) => (
                <CarouselItem key={collection.name} className="basis-full sm:basis-1/2" >
                    <div className="relative rounded-md overflow-hidden h-60 lg:h-96">
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-40 z-20" />
                        <img src={builder.image(collection.image.asset._ref).url()} alt={collection.image.alt} className="absolute inset-0 w-full h-full object-cover z-10" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center z-30">
                            <h3 className="text-md text-white sm:text-lg">{collection.name}</h3>
                            <div className="flex items-center gap-2">
                                <a href={`/colecoes/${collection.slug.current}`} className="text-white text-sm sm:text-base">Ver mais</a>
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
    </CarouselComponent>
}