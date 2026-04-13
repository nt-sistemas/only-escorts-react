import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLoading } from "../context/LoadingContext";
import { Search, MapPin, Heart } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  listModelCities,
  getModelStoryByProfileId,
  listModelStories,
  type CatalogModel,
} from "../services/models";

const DEFAULT_GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Trans"];
const DEFAULT_CATEGORY_OPTIONS = ["VIP", "Premium", "Standard"];

const MOCK_STORIES: Story[] = [];

export function Models() {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [models, setModels] = useState<CatalogModel[]>([]);
  const [modelsNotice, setModelsNotice] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(
    DEFAULT_CATEGORY_OPTIONS,
  );
  const [genderOptions, setGenderOptions] = useState<string[]>(
    DEFAULT_GENDER_OPTIONS,
  );
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchModels = async () => {
      startLoading();

      try {
        const [apiModels, apiCategories, apiGenders, apiCities, apiStories] =
          await Promise.all([
            listModels(),
            listModelCategories(),
            listModelGenders(),
            listModelCities(),
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
        setCityOptions(
          apiCities.length > 0
            ? apiCities
            : Array.from(
                new Set(
                  apiModels
                    .map((model) => model.city?.trim() ?? "")
                    .filter(Boolean),
                ),
              ),
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
        setCityOptions([]);
        setModelsNotice("Could not reach API.");
      } finally {
        if (!cancelled) {
          stopLoading();
        }
      }
    };

    fetchModels();

    return () => {
      cancelled = true;
    };
  }, [startLoading, stopLoading]);

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
      prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)),
    );
  };

  const handleCloseViewer = () => {
    setActiveStoryIndex(null);
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || model.category === categoryFilter;
    const matchesGender =
      genderFilter === "all" || model.gender === genderFilter;
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
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
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
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Cities</SelectItem>
                {cityOptions.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-neutral-400">
          {filteredModels.length}{" "}
          {filteredModels.length === 1 ? "model found" : "models found"}
        </p>
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
