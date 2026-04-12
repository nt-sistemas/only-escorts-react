import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Heart } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { WatermarkedImage } from "../components/ui/watermarked-image";
import { StoriesReel, StoriesViewer } from "../components/stories";
import type { Story } from "../components/stories";
import {
  listModels,
  listModelCategories,
  listModelGenders,
  getModelStoryByProfileId,
  listModelStories,
  type CatalogModel,
} from "../services/models";

const DEFAULT_GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Trans"];
const DEFAULT_CATEGORY_OPTIONS = ["VIP", "Premium", "Standard"];

const MOCK_STORIES: Story[] = [];

const MOCK_MODELS = [
  {
    id: 1,
    name: "Isabela Santos",
    age: 25,
    city: "São Paulo",
    category: "VIP",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mjk0MDk5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    price: "€ 500,00/h",
    verified: true,
    videos: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
    testimonials: [
      {
        id: 1,
        author: "Carlos M.",
        comment: "Excellent service and very professional.",
        rating: 5,
      },
    ],
  },
  {
    id: 2,
    name: "Rafael Costa",
    age: 28,
    city: "Rio de Janeiro",
    category: "Premium",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI5NTM5OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "€ 400,00/h",
    verified: true,
    videos: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"],
    testimonials: [
      {
        id: 1,
        author: "André",
        comment: "Punctual and respectful. Great experience.",
        rating: 4,
      },
    ],
  },
  {
    id: 3,
    name: "Mariana Oliveira",
    age: 23,
    city: "Brasília",
    category: "VIP",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBtb2RlbHxlbnwxfHx8fDE3NzI5ODU3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "€ 600,00/h",
    verified: true,
    videos: [],
    testimonials: [
      {
        id: 1,
        author: "Roberto S.",
        comment: "Five-star attention and communication.",
        rating: 5,
      },
    ],
  },
  {
    id: 4,
    name: "Lucas Fernandes",
    age: 30,
    city: "São Paulo",
    category: "Premium",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1735777192155-dec95124a585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kc29tZSUyMG1hbiUyMG1vZGVsfGVufDF8fHx8MTc3Mjk4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    price: "€ 450,00/h",
    verified: false,
    videos: [],
    testimonials: [],
  },
  {
    id: 5,
    name: "Juliana Rocha",
    age: 27,
    city: "Curitiba",
    category: "Standard",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1633443362894-227325b61ddf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjkwODYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    price: "€ 300,00/h",
    verified: true,
    videos: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
    testimonials: [
      {
        id: 1,
        author: "Gustavo",
        comment: "Friendly and very attentive.",
        rating: 4,
      },
    ],
  },
  {
    id: 6,
    name: "Bruno Silva",
    age: 26,
    city: "Porto Alegre",
    category: "Standard",
    gender: "Male",
    image: "https://images.unsplash.com/flagged/photo-1594170954639-ff95b015b546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyOTg1NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    price: "€ 350,00/h",
    verified: true,
    videos: [],
    testimonials: [
      {
        id: 1,
        author: "Pedro",
        comment: "Very discreet and reliable.",
        rating: 5,
      },
    ],
  },
];

export function Models() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [models, setModels] = useState<CatalogModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsNotice, setModelsNotice] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(
    DEFAULT_CATEGORY_OPTIONS,
  );
  const [genderOptions, setGenderOptions] = useState<string[]>(
    DEFAULT_GENDER_OPTIONS,
  );
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchModels = async () => {
      setIsLoadingModels(true);

      try {
        const [apiModels, apiCategories, apiGenders, apiStories] =
          await Promise.all([
          listModels(),
          listModelCategories(),
          listModelGenders(),
          listModelStories(),
        ]);
        if (cancelled) {
          return;
        }

        setCategoryOptions(
          apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORY_OPTIONS,
        );
        setGenderOptions(
          apiGenders.length > 0 ? apiGenders : DEFAULT_GENDER_OPTIONS,
        );

        setModels(apiModels);
        setStories(apiStories.length > 0 ? apiStories : MOCK_STORIES);
        setModelsNotice(
          apiModels.length === 0 ? "API returned no models." : null,
        );
      } catch {
        if (cancelled) {
          return;
        }

        setModels([]);
        setStories(MOCK_STORIES);
        setCategoryOptions(DEFAULT_CATEGORY_OPTIONS);
        setGenderOptions(DEFAULT_GENDER_OPTIONS);
        setModelsNotice("Could not reach API.");
      } finally {
        if (!cancelled) {
          setIsLoadingModels(false);
        }
      }
    };

    fetchModels();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStoryClick = async (index: number) => {
    const selectedStory = stories[index];

    if (!selectedStory) {
      return;
    }

    try {
      const story = await getModelStoryByProfileId(selectedStory.id);

      setStories((prev) =>
        prev.map((existingStory, storyIndex) =>
          storyIndex === index
            ? { ...story, viewed: existingStory.viewed }
            : existingStory,
        ),
      );
    } catch {
      // Keep current story payload as fallback.
    }

    setActiveStoryIndex(index);
  };

  const handleStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  const handleCloseViewer = () => {
    setActiveStoryIndex(null);
  };

  const getModelGallery = (model: CatalogModel) => {
    const fallbackImage = model.image;
    const gallery = [
      fallbackImage,
      ...(model.gallery ?? []),
    ];

    return Array.from(new Set(gallery)).slice(0, 4);
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || model.category === categoryFilter;
    const matchesGender = genderFilter === "all" || model.gender === genderFilter;
    const matchesCity = cityFilter === "all" || model.city === cityFilter;
    
    return matchesSearch && matchesCategory && matchesGender && matchesCity;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Find Luxury Companions
        </h1>
        <p className="text-neutral-400 text-lg">
          The best professionals are here
        </p>
      </div>

      {/* Stories */}
      {stories.length > 0 && (
        <StoriesReel stories={stories} onStoryClick={handleStoryClick} />
      )}

      {/* Story Viewer */}
      {activeStoryIndex !== null && (
        <StoriesViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={handleCloseViewer}
          onStoryViewed={handleStoryViewed}
        />
      )}

      {/* Filters */}
      <Card className="bg-neutral-900 border-neutral-800 mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Genders</SelectItem>
                {genderOptions.map((gender) => (
                  <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="São Paulo">São Paulo</SelectItem>
                <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                <SelectItem value="Brasília">Brasília</SelectItem>
                <SelectItem value="Curitiba">Curitiba</SelectItem>
                <SelectItem value="Porto Alegre">Porto Alegre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-neutral-400">
          {filteredModels.length} {filteredModels.length === 1 ? "model found" : "models found"}
        </p>
        {isLoadingModels && (
          <p className="text-neutral-500 text-sm mt-1">Loading models from API...</p>
        )}
        {modelsNotice && (
          <p className="text-neutral-500 text-sm mt-1">{modelsNotice}</p>
        )}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => {
          return (
            <Card
              key={model.id}
              className="bg-neutral-900 border-neutral-800 overflow-hidden hover:border-pink-500 transition group cursor-pointer"
              onClick={() => navigate(`/model/${model.id}`)}
            >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <WatermarkedImage
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    containerClassName="w-full h-full"
                  />
                  {model.verified && (
                    <Badge className="absolute top-3 left-3 bg-pink-500 text-white border-0">
                      Verified
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-neutral-900/80 text-white border-0">
                    {model.category}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-3 right-3 bg-neutral-900/80 hover:bg-pink-500 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {model.name}
                    {typeof model.age === "number" ? `, ${model.age}` : ""}
                  </h3>
                  {model.city && (
                    <div className="flex items-center text-neutral-400 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {model.city}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {model.price ? (
                      <span className="font-highlight text-pink-500 font-bold tracking-tight">
                        {model.price}
                      </span>
                    ) : (
                      <span className="text-neutral-500">Price unavailable</span>
                    )}
                    {model.gender && (
                      <Badge
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                      >
                        {model.gender}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
          );
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg">
            No models found with the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}
