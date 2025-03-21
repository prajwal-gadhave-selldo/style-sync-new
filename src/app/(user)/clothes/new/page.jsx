import Heading from '@/components/Heading';
import UploadingForm from '@/components/UploadingForm';

const AddNewClothesPage = () => {
  return (
    <section className="w-full h-full">
      <Heading title="Clothes" subTitle="Add new clothes" />
      <UploadingForm />
    </section>
  );
};

export default AddNewClothesPage;
