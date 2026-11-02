import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, RotateCcw, Search, ArrowUpDown } from "lucide-react";
import { fetchCars, type Car } from "../api/carsApi";
import { CarCard } from "./CarCards";

const normalize = (s: string) =>
  (s || "").toLowerCase().replace(/\s+/g, " ").trim();

const formatModelTitle = (s: string) =>
  s
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
    .join(" ");

type SortOption = "price-asc" | "price-desc" | "benefit-desc";

type CarsInStockProps = {
  onReserve: (car: Car) => void;
  externalFilterRequest?: { model: string; timestamp: number } | null;
};

export const CarsInStock = ({
  onReserve,
  externalFilterRequest,
}: CarsInStockProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [complectationFilter, setComplectationFilter] = useState<string>("all");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    fetchCars()
      .then(setCars)
      .catch(() => setError("Ошибка загрузки автомобилей"))
      .finally(() => setLoading(false));
  }, []);

  // Список уникальных моделей с количеством авто в наличии
  const modelsWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const car of cars) {
      const key = normalize(car.model);
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [cars]);

  // Синхронизация при клике «Авто в наличии» в карточке модельного ряда
  useEffect(() => {
    if (!externalFilterRequest || !externalFilterRequest.model) return;
    const target = normalize(externalFilterRequest.model.replace(/^lada\s+/i, ""));
    if (!target) return;

    const availableNames = modelsWithCounts.map((m) => m.name);
    let matched = "all";

    if (availableNames.includes(target)) {
      matched = target;
    } else {
      // Если в фиде Cross-версии объединены с базовой моделью (например, Granta Cross -> Granta, Vesta Cross -> Vesta)
      const baseModel = target.replace(/\s+cross$/i, "").trim();
      const partialMatch = availableNames.find(
        (m) => m === baseModel || m.includes(baseModel) || target.includes(m)
      );
      if (partialMatch) {
        matched = partialMatch;
      }
    }

    setModelFilter(matched);
    setComplectationFilter("all");
    setMaxPriceFilter(0);
    setSearchQuery("");
  }, [externalFilterRequest, modelsWithCounts]);

  // Сброс пагинации при изменении любого фильтра
  useEffect(() => {
    setVisibleCount(9);
  }, [modelFilter, complectationFilter, maxPriceFilter, searchQuery, sortBy]);

  // Доступные комплектации с учетом выбранной модели
  const availableComplectations = useMemo(() => {
    const baseCars =
      modelFilter === "all"
        ? cars
        : cars.filter((c) => normalize(c.model) === modelFilter);
    const unique = new Set<string>();
    for (const c of baseCars) {
      const comp = (c.complectation || "").trim();
      if (comp) unique.add(comp);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "ru"));
  }, [cars, modelFilter]);

  // Если выбранная комплектация отсутствует у новой выбранной модели — сбрасываем её
  useEffect(() => {
    if (
      complectationFilter !== "all" &&
      !availableComplectations.includes(complectationFilter)
    ) {
      setComplectationFilter("all");
    }
  }, [availableComplectations, complectationFilter]);

  const filteredAndSorted = useMemo(() => {
    const q = normalize(searchQuery);

    const result = cars.filter((c) => {
      if (modelFilter !== "all" && normalize(c.model) !== modelFilter) {
        return false;
      }
      if (
        complectationFilter !== "all" &&
        (c.complectation || "").trim() !== complectationFilter
      ) {
        return false;
      }
      const effectivePrice = Math.max(c.finalPrice || c.price || 0, 0);
      if (maxPriceFilter > 0 && effectivePrice > maxPriceFilter) {
        return false;
      }
      if (q) {
        const haystack = normalize(
          `${c.brand} ${c.model} ${c.complectation} ${c.vin || ""}`
        );
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      const priceA = Math.max(a.finalPrice || a.price || 0, 0);
      const priceB = Math.max(b.finalPrice || b.price || 0, 0);
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      // benefit-desc
      const benA = Math.max((a.price || 0) - priceA, 0);
      const benB = Math.max((b.price || 0) - priceB, 0);
      return benB - benA;
    });
  }, [cars, modelFilter, complectationFilter, maxPriceFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    modelFilter !== "all" ||
    complectationFilter !== "all" ||
    maxPriceFilter > 0 ||
    searchQuery.trim() !== "";

  const resetAllFilters = () => {
    setModelFilter("all");
    setComplectationFilter("all");
    setMaxPriceFilter(0);
    setSearchQuery("");
    setSortBy("price-asc");
  };

  const budgetOptions = [
    { label: "Любой бюджет", value: 0 },
    { label: "До 900 000 ₽", value: 900000 },
    { label: "До 1 100 000 ₽", value: 1100000 },
    { label: "До 1 350 000 ₽", value: 1350000 },
    { label: "До 1 500 000 ₽", value: 1500000 },
  ];

  if (loading) {
    return (
      <section className="py-16 bg-white" id="stock">
        <div className="container mx-auto px-4 text-center text-gray-500 font-semibold">
          Загрузка автомобилей в наличии...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white" id="stock">
        <div className="container mx-auto px-4 text-center text-red-500 font-semibold">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-white scroll-mt-20" id="stock">
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ff6700] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6700]" />
              <span>Склад официального дилера в Великих Луках</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#26303a] tracking-tight">
              АВТОМОБИЛИ В НАЛИЧИИ
            </h2>
          </div>
          <div className="text-sm font-semibold text-gray-500">
            Все автомобили с ПТС · Готовы к выдаче за 1 день
          </div>
        </div>

        {/* Фирменная панель фильтрации */}
        <div className="bg-[#f5f6f8] border border-gray-200/90 rounded-2xl p-4 sm:p-6 mb-10 shadow-xs">
          {/* 1-й ряд: Быстрый выбор модели с количеством авто */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6700]" />
                Выберите модель:
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6700] hover:text-[#e55c00] transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сбросить фильтры</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModelFilter("all")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition ${
                  modelFilter === "all"
                    ? "bg-[#26303a] text-white border-[#26303a] shadow-xs"
                    : "bg-white text-[#26303a] border-gray-200 hover:border-[#ff6700]"
                }`}
              >
                <span>Все модели</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-extrabold tabular-nums ${
                    modelFilter === "all"
                      ? "bg-white/15 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cars.length}
                </span>
              </button>

              {modelsWithCounts.map(({ name, count }) => {
                const isActive = modelFilter === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setModelFilter(name)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition ${
                      isActive
                        ? "bg-[#ff6700] text-white border-[#ff6700] shadow-xs"
                        : "bg-white text-[#26303a] border-gray-200 hover:border-[#ff6700]"
                    }`}
                  >
                    <span>LADA {formatModelTitle(name)}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-extrabold tabular-nums ${
                        isActive
                          ? "bg-black/15 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-й ряд: Комплектация, бюджет, поиск по VIN и сортировка */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-200/80">
            {/* Комплектация */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Комплектация
              </label>
              <select
                value={complectationFilter}
                onChange={(e) => setComplectationFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#26303a] focus:outline-none focus:border-[#ff6700] transition"
              >
                <option value="all">Все комплектации ({availableComplectations.length})</option>
                {availableComplectations.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            {/* Бюджет (цена со скидкой) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Бюджет по акции
              </label>
              <select
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#26303a] focus:outline-none focus:border-[#ff6700] transition"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Сортировка */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-[#ff6700]" />
                Сортировка
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#26303a] focus:outline-none focus:border-[#ff6700] transition"
              >
                <option value="price-asc">Сначала доступные (по цене ↑)</option>
                <option value="price-desc">Сначала дорогие (по цене ↓)</option>
                <option value="benefit-desc">По максимальной выгоде</option>
              </select>
            </div>

            {/* Поиск по комплектации или VIN */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Поиск по VIN или версии
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Например: Техно или VIN..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-medium text-[#26303a] placeholder:text-gray-400 focus:outline-none focus:border-[#ff6700] transition"
                />
              </div>
            </div>
          </div>

          {/* Нижняя строка статуса фильтра */}
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
            <div>
              Найдено автомобилей:{" "}
              <strong className="text-[#26303a] font-extrabold tabular-nums">
                {filteredAndSorted.length}
              </strong>
              {modelFilter !== "all" && (
                <span>
                  {" "}
                  · Модель: <strong className="text-[#ff6700]">LADA {formatModelTitle(modelFilter)}</strong>
                </span>
              )}
            </div>
            <div className="text-gray-500">
              Дополнительная скидка при обмене по Trade-In и покупке в кредит
            </div>
          </div>
        </div>

        {/* Сетка карточек автомобилей */}
        {filteredAndSorted.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredAndSorted.slice(0, visibleCount).map((car) => (
                <CarCard key={car.id} car={car} onReserve={onReserve} />
              ))}
            </div>

            {visibleCount < filteredAndSorted.length && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  className="px-8 py-3.5 rounded-xl text-sm font-extrabold bg-[#f5f6f8] border border-gray-300 text-[#26303a] hover:border-[#ff6700] hover:bg-[#ff6700] hover:text-white transition-all shadow-xs"
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                >
                  Показать ещё автомобили ({filteredAndSorted.length - visibleCount})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#f5f6f8] border border-gray-200 rounded-2xl p-10 text-center max-w-xl mx-auto">
            <p className="text-lg font-extrabold text-[#26303a] mb-2">
              По выбранным параметрам автомобили не найдены
            </p>
            <p className="text-sm text-gray-500 mb-5">
              Попробуйте сбросить часть фильтров или выберите все модели в наличии.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="bg-[#ff6700] hover:bg-[#e55c00] text-white font-bold text-sm px-6 py-3 rounded-xl transition"
            >
              Показать все автомобили ({cars.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
