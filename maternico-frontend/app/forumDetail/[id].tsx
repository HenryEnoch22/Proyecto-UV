import FormTextField from "@/components/FormTextField";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/contexts/AuthContext";
import { createComment, getForum, getForumComments } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { ArrowLongLeftIcon } from "react-native-heroicons/solid";

const ForumDetail = () => {
    const { user } = useAuth();
	const { id } = useLocalSearchParams();
	const [forum, setForum] = useState(null);
    const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [showInput, setShowInput] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
            try {
                setLoading(true);
                // Obtener foro
                const forumData = await getForum(id);
                if (forumData.data) {
                    setForum(forumData.data);
                    // Obtener comentarios con owner
                    const commentsData = await getForumComments(forumData.data.id);
                    setComments(commentsData.data || []);
                } else {
                    setError("Foro no encontrado");
                }
            } catch (err) {
                setError("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSendComment = async () => { // Hacer la función async
        if (!showInput) {
            setShowInput(true);
            return;
        }
    
        if (inputText.trim() === "") {
            setError("No se puede enviar un comentario vacío");
            return;
        }
    
        try {
            await createComment(user.id, forum.id, inputText);
            setInputText("");
            setShowInput(false);
            
            // Actualizar lista de comentarios
            const updatedComments = await getForumComments(forum.id);
            setComments(updatedComments.data || []);
        } catch (error) {
            setError("Error al enviar el comentario");
    }}

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

	if (forum) {
		return (
			<ScrollView style={styles.container}>
				<View style={styles.header}>
					<Pressable onPress={() => router.back()} style={styles.backButton}>
						<ArrowLongLeftIcon size={24} color="#FEFEFE" />
					</Pressable>
					<Text style={styles.headerTitle}>Publicación</Text>
				</View>

				<View style={styles.mainContent}>
					<View style={styles.tweetContainer}>
						<View style={styles.userInfo}>
							<View style={styles.userDetails}>
								<Text style={styles.userName}>
									{`${forum.owner.name} ${forum.owner.last_name} ${forum.owner.mother_last_name}`}
								</Text>
							</View>
						</View>

						<Text style={styles.tweetText}>{forum.text}</Text>

						<View style={styles.tweetMetrics}>
							<Text style={styles.metricText}>{forum.comments.length} respuestas</Text>
						</View>
					</View>

					{/* Sección de comentarios */}
					<Text style={styles.commentsTitle}>Respuestas</Text>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <View key={index} style={styles.commentContainer}>
                                <View style={styles.commentUser}>
                                    <View style={styles.commentInitials}>
                                        <Text style={styles.initialsText}>
                                            {`${comment.owner.name[0]}${comment.owner.last_name[0]}`}
                                        </Text>
                                    </View>
                                    <View style={styles.commentContent}>
                                        <View style={styles.commentHeader}>
                                            <Text style={styles.commentName}>
                                                {`${comment.owner.name} ${comment.owner.last_name}`}
                                            </Text>
                                            <Text style={styles.commentHandle}>
                                                @{comment.owner.email.split("@")[0]}
                                            </Text>
                                        </View>
                                        <Text style={styles.commentText}>{comment.text}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
						<>
                            <Text style={styles.noComments}>Sé el primero en responder</Text>
                            {showInput && (
                                <FormTextField
                                placeholder="Yo te recomiendo que..."
                                multiline
                                numberOfLines={4}
                                value={inputText}
                                onChangeText={(e) => setInputText(e)}
                                style={styles.mainInput}
                            />)}
                            <PrimaryButton 
                                style={styles.floatingButton}
                                onPress={handleSendComment}
                                text="Agregar comentario"
                            />
                        </>
					)}
				</View>
			</ScrollView>
		);
	} else {
		return (
			<View>
				<Text>Hubo un error al obtener el foro, intentalo mas tarde. {error}</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: "10%",
        backgroundColor: '#F392BE',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        color: '#FEFEFE',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        padding: 16,
    },
    tweetContainer: {
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userInitials: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F392BE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initialsText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    userDetails: {
        flexDirection: 'column',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    userHandle: {
        color: '#657786',
        fontSize: 14,
    },
    tweetText: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 12,
    },
    tweetMetrics: {
        flexDirection: 'row',
        gap: 24,
    },
    metricText: {
        color: '#657786',
        fontSize: 14,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 16,
    },
    commentContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    commentUser: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    commentInitials: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F392BE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    commentName: {
        fontWeight: 'bold',
    },
    commentHandle: {
        color: '#657786',
        fontSize: 14,
    },
    commentText: {
        fontSize: 15,
        lineHeight: 20,
    },
    noComments: {
        color: '#657786',
        textAlign: 'center',
        marginTop: 16,
    },
    mainInput: {
        margin: 16,
        borderRadius: 12,
        borderColor: "#666666",
        borderWidth: 1,
        padding: 16,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    floatingButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
  
    },
});

export default ForumDetail;
