import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FiltersPanel from "../components/resources/FiltersPanel";
import ResourceCard from "../components/resources/ResourceCard";
import PaginationControls from "../components/ui/PaginationControls";
import SectionHeading from "../components/ui/SectionHeading";
import { apiRequest } from "../lib/api";

const defaultFilters = {
  search: "",
  subject: "",
  classLevel: "",
  type: ""
};

function ResourcesPage() {
  const [params, setParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
    total: 0,
    totalPages: 1
  });

  const filters = useMemo(
    () => ({
      search: params.get("search") || "",
      subject: params.get("subject") || "",
      classLevel: params.get("classLevel") || "",
      type: params.get("type") || "",
      page: Number(params.get("page") || "1")
    }),
    [params]
  );

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value)
    );
    query.set("pageSize", "9");

    apiRequest(`/resources?${query.toString()}`)
      .then((data) => {
        setResources(data.resources);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.set("page", "1");
    setParams(next);
  }

  function resetFilters() {
    setParams(defaultFilters);
  }

  function changePage(page) {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    setParams(next);
  }

  return (
    <div className="container-shell py-12">
      <SectionHeading
        eyebrow="Resources Library"
        title="Textbooks, slides, and past questions in one place"
        description="Search and filter learning materials by subject, class level, and document type."
      />

      <div className="mt-8">
        <FiltersPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {loading ? "Loading resources..." : `${pagination.total} resource${pagination.total === 1 ? "" : "s"} found`}
        </p>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card-surface h-64 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : resources.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="card-surface mt-8 p-10 text-center">
          <h3 className="text-xl font-extrabold text-slate-900">No resources found</h3>
          <p className="mt-3 text-sm text-slate-600">
            Try adjusting your filters or search using a broader keyword.
          </p>
        </div>
      )}

      <PaginationControls
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={changePage}
        disabled={loading}
      />
    </div>
  );
}

export default ResourcesPage;
