import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { ArrowRight } from "lucide-react"

const collections = [
    {
        image: "/public/collections/cards/basicos.jpg",
        title: "Básicos",
    },
    {
        image: "/public/collections/cards/verao.jpg",
        title: "Verão",
    },
    {
        image: "/public/collections/cards/inverno.jpg",
        title: "Inverno",
    },
]


export default function CollectionsCarousel() {
    return (
        <Carousel
        opts={{
          align: "start",
          loop: true,
          
        }}
        className="w-full h-96"
      >
        <CarouselContent>
          {collections.map((collection, index) => (
            <CollectionsCarouselItem key={index} collection={collection} />
          ))}
        </CarouselContent>
        <CarouselNext className="hidden md:flex"/>
        <CarouselPrevious className="hidden md:flex"/>
      </Carousel>
    )
}


function CollectionsCarouselItem({ collection }: { collection: typeof collections[number] }) {
    return (
        <CarouselItem key={collection.title} className="sm:basis-1/2">
            <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-40" />
                <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">{collection.title}</h3>
                    <div className="flex items-center gap-2">
                        <a href={`/collections/${collection.title}`} className="text-white">Ver mais</a>
                        <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
        </CarouselItem>
    )
}