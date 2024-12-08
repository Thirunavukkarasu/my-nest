import NewFlatForm from '../FlatForm'

export default function NewFlatPage() {
    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Add New Flat</h1>
            <NewFlatForm isEditMode={false} />
        </div>
    )
}

