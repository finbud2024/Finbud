<div class="chat-window">
    <slot></slot> <!-- Use slot for message components -->
  </div>
</template>

<script>
export default {
  name: 'ChatWindow'
}
</script>

<style scoped>
.chat-window {
  height: 90%;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  max-height: 1000px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>