import { useLocalSearchParams } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { ArrowLongLeftIcon, EllipsisVerticalIcon } from "react-native-heroicons/solid";
import { createComment, deleteComment, deleteForum, getForumComments, markCommentsAsRead, updateForum } from "@/services/api";
import { CommentsList } from "@/components/CommentsList";
import FormTextField from "@/components/FormTextField";
import PrimaryButton from "@/components/PrimaryButton";
import ForumEditModal from "@/components/ForumEditModal";
import ForumOptionsMenu from "@/components/ForumOptionMenu";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useForum } from "@/hooks/useForum";

const ForumDetail = () => {
    const { id } = useLocalSearchParams();
    const { user, loading: userLoading, error: userError } = useUser();
    const { comments, fetchForum, forum, loading, setComments } = useForum(Number(id));
    const [inputText, setInputText] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedText, setEditedText] = useState("");
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const ellipsisIconRef = useRef(null);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const isForumOwner = !!user && !!forum && user.id === forum.owner.id;

    useEffect(() => {
		if (!id) return;

		const loadData = async () => {
			try {
				await fetchForum();
				
				if (forum && isForumOwner) {
					try {
						console.log("Marcando cometarios como leídos", user.id, forum.id);
						await markCommentsAsRead(
							user.id, 
							Number(forum.id)
						);
					} catch (error) {
						console.error("Error actualizando estado 'visto':", error);
					}
				}
				
				if (forum) {
					setEditedTitle(forum.title);
					setEditedText(forum.text);
				}
			} catch (error) {
				setError("Error al cargar el foro");
			}
		};

		loadData();

		return () => {
			setEditedTitle("");
			setEditedText("");
		};
	}, [id, user?.id]);

    const showOptions = () => {
        if (ellipsisIconRef.current) {
            ellipsisIconRef.current.measure(
                (width: number, height: number, pageX: number, pageY: number) => {
                    setMenuPosition({
                        top: pageY + height,
                        right: Dimensions.get("window").width - (pageX + width),
                    });
                    setShowOptionsMenu(true);
                }
            );
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            const updatedComments = await getForumComments(Number(forum?.id));
            setComments(updatedComments.data || []);
        } catch (error) {
            setError("Error al eliminar el comentario");
        }
    };

    const handleSendComment = async () => {
        if (!showInput) {
            setShowInput(true);
            return;
        }
        setError(null);

        if (!inputText.trim()) {
            setError("No se puede enviar un comentario vacío");
            return;
        }

        try {
            if (user?.id && forum?.id) {
                await createComment(user.id, Number(forum.id), inputText);
                setInputText("");
                setShowInput(false);
                const updatedComments = await getForumComments(forum.id);
                setComments(updatedComments.data);
            }
        } catch (error) {
            setError("Error al enviar el comentario");
        }
    };

    const handleUpdateForum = async () => {
        if (!editedTitle.trim() || !editedText.trim()) {
            setError("Ambos campos son requeridos");
            return;
        }

        try {
            if (forum?.id) {
                await updateForum(forum.id, editedTitle, editedText);
                setShowEditModal(false);
                setError(null);
                await fetchForum();
            }
        } catch (error) {
            setError("Error al actualizar el foro");
        }
    };

    const handleDeleteForum = async () => {
        try {
            if (forum?.id) {
                await deleteForum(forum.id);
                router.replace("/(tabs)/forum");
            }
        } catch (error) {
            setError("Error al eliminar el foro");
        } finally {
            setShowOptionsMenu(false);
        }
    };

    if (userLoading || loading || !forum || !user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f392be" />
                <Text style={styles.loadingText}>Cargando datos...</Text>
            </View>
        );
    }

    if (!forum) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>
                    Hubo un error al obtener el foro, inténtalo más tarde.
                </Text>
                {error && <Text style={styles.errorDetail}>{error}</Text>}
                <PrimaryButton
                    text="Volver"
                    onPress={() => router.back()}
                    style={styles.backToForumsButton}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLongLeftIcon size={24} color="#FEFEFE" />
                </Pressable>
                <Text style={styles.headerTitle}>{forum.title}</Text>
                {isForumOwner && (
                    <Pressable
                        ref={ellipsisIconRef}
                        onPress={showOptions}
                        style={styles.optionsButton}
                    >
                        <EllipsisVerticalIcon size={24} color="#FEFEFE" />
                    </Pressable>
                )}
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
                        <Text style={styles.metricText}>
                            {forum.comments.length} respuestas
                        </Text>
                    </View>
                </View>
                
                <CommentsList
                    comments={comments}
                    currentUserId={user?.id}
                    onDeleteComment={handleDeleteComment}
                />

                {showInput && (
                    <>
                        <FormTextField
                            placeholder="Yo te recomiendo que..."
                            multiline
                            numberOfLines={4}
                            value={inputText}
                            onChangeText={(text: string) => {
                                setInputText(text);
                                setError(null);
                            }}
                            style={styles.mainInput}
                        />
                        {!!error && <Text style={styles.errorText}>{error}</Text>}
                    </>
                )}

                <PrimaryButton
                    style={styles.floatingButton}
                    onPress={handleSendComment}
                    text={showInput ? "Enviar comentario" : "Agregar comentario"}
                />
            </View>

            <ForumEditModal
                visible={showEditModal}
                onClose={() => setShowEditModal(false)}
                editedTitle={editedTitle}
                editedText={editedText}
                onTitleChange={setEditedTitle}
                onTextChange={setEditedText}
                onSave={handleUpdateForum}
                error={error || undefined}
            />

            <ForumOptionsMenu
                visible={showOptionsMenu}
                position={menuPosition}
                onClose={() => setShowOptionsMenu(false)}
                onEdit={() => setShowEditModal(true)}
                onDelete={handleDeleteForum}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	loadingText: {
		color: "#f392be",
		fontSize: 16,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		paddingTop: "10%",
		backgroundColor: "#F392BE",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	backButton: {
		marginRight: 16,
	},
	headerTitle: {
		color: "#FEFEFE",
		fontSize: 18,
		fontWeight: "bold",
		flex: 1,
	},
	optionsButton: {
		padding: 8,
	},
	mainContent: {
		flex: 1,
		padding: 16,
	},
	tweetContainer: {
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e5e5",
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	userDetails: {
		flexDirection: "column",
	},
	userName: {
		fontWeight: "bold",
		fontSize: 16,
	},
	tweetText: {
		fontSize: 16,
		lineHeight: 22,
		marginBottom: 12,
	},
	tweetMetrics: {
		flexDirection: "row",
		gap: 24,
	},
	metricText: {
		color: "#657786",
		fontSize: 14,
	},
	commentsTitle: {
		fontSize: 18,
		fontWeight: "bold",
		paddingVertical: 16,
	},
	mainInput: {
		margin: 16,
		borderRadius: 12,
		borderColor: "#666666",
		borderWidth: 1,
		padding: 16,
		fontSize: 16,
		minHeight: 100,
		textAlignVertical: "top",
	},
	floatingButton: {
		backgroundColor: "#3b82f6",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 25,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
	},
	errorText: {
		color: "red",
		marginHorizontal: 16,
		marginTop: 8,
		fontSize: 14,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	errorMessage: {
		fontSize: 18,
		color: "#64748b",
		textAlign: "center",
		marginBottom: 8,
	},
	errorDetail: {
		fontSize: 14,
		color: "#e11d48",
		textAlign: "center",
		marginBottom: 24,
	},
	backToForumsButton: {
		width: "80%",
		marginTop: 16,
	},
});

export default ForumDetail;
