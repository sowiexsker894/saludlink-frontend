// HU17: Calificación y reseñas de atención
export interface RatingReview {
  id: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  rating: number; // 1-5
  comment: string;
  categories: {
    professionalism: number;
    communication: number;
    attentiveness: number;
  };
  createdAt: Date;
  isPublic: boolean;
}

export interface RatingReviewRequest {
  appointmentId: number;
  rating: number;
  comment: string;
  categories: {
    professionalism: number;
    communication: number;
    attentiveness: number;
  };
  isPublic: boolean;
}

export interface DoctorRatingStats {
  doctorId: number;
  averageRating: number;
  totalReviews: number;
  reviews: RatingReview[];
}
