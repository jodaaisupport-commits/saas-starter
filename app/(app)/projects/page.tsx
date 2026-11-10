import { getProjects } from '@/app/actions/projects'
import Link from 'next/link'
import CreateProjectForm from '@/components/CreateProjectForm'
import DeleteProjectButton from '@/components/DeleteProjectButton'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Projekte</h1>
        <p className="text-gray-500 text-sm mt-1">Erstellen und verwalten Sie Ihre Projekte.</p>
      </div>

      <CreateProjectForm />

      <div className="mt-8 space-y-3">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">Noch keine Projekte vorhanden.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div>
                <Link
                  href={`/projects/${project.id}`}
                  className="font-medium hover:text-violet-600 transition"
                >
                  {project.title}
                </Link>
                {project.description && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                    {project.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Erstellt: {new Date(project.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
              <DeleteProjectButton id={project.id} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
